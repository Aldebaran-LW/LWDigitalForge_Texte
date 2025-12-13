from __future__ import annotations

import shutil
import tempfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from git import Repo

from app.settings import settings
from app.supabase_client import get_supabase
from app.analyzers.basic import run_basic_checks
from app.analyzers.github_actions import run_github_actions_checks


@dataclass
class RunResult:
    status: str
    repo_url: str | None
    ref: str | None
    summary: dict
    findings: list[dict]


def _normalize_repo_url(repo_url: str | None, owner: str | None, repo: str | None) -> str | None:
    if repo_url:
        return repo_url
    if owner and repo:
        return f"https://github.com/{owner}/{repo}"
    return None


def _parse_github_owner_repo(repo_url: str) -> tuple[str, str] | None:
    """Extrai owner/repo de URLs https://github.com/owner/repo(.git)."""
    try:
        u = urlparse(repo_url)
    except Exception:  # noqa: BLE001
        return None
    if u.netloc.lower() != "github.com":
        return None
    parts = [p for p in u.path.split("/") if p]
    if len(parts) < 2:
        return None
    owner = parts[0]
    repo = parts[1]
    if repo.endswith(".git"):
        repo = repo[:-4]
    return owner, repo


def _auth_repo_url_if_needed(repo_url: str) -> str:
    """Se for GitHub e tiver token, injeta auth no clone (sem alterar o repo_url persistido)."""
    if not settings.github_token:
        return repo_url
    parsed = _parse_github_owner_repo(repo_url)
    if not parsed:
        return repo_url
    owner, repo = parsed
    # 'x-access-token' funciona com GitHub HTTPS
    return f"https://x-access-token:{settings.github_token}@github.com/{owner}/{repo}.git"


def _redact_secrets(msg: str) -> str:
    """Evita vazamento de tokens em logs/findings."""
    if settings.github_token and settings.github_token in msg:
        msg = msg.replace(settings.github_token, "***REDACTED***")
    if settings.supabase_service_role_key and settings.supabase_service_role_key in msg:
        msg = msg.replace(settings.supabase_service_role_key, "***REDACTED***")
    return msg


def _list_repos_to_analyze() -> list[str]:
    sb = get_supabase()
    if not sb:
        return []
    resp = sb.table("repositories").select("repo_url").eq("enabled", True).execute()
    return [r["repo_url"] for r in (resp.data or [])]


def _insert_run(repo_url: str, ref: str | None, triggered_by: str) -> int | None:
    sb = get_supabase()
    if not sb:
        return None
    resp = (
        sb.table("analysis_runs")
        .insert(
            {
                "repo_url": repo_url,
                "ref": ref,
                "triggered_by": triggered_by,
                "status": "running",
                "summary": {},
            }
        )
        .execute()
    )
    if resp.data:
        return resp.data[0]["id"]
    return None


def _finish_run(run_id: int, status: str, summary: dict, findings: list[dict]):
    sb = get_supabase()
    if not sb:
        return

    sb.table("analysis_runs").update({"status": status, "summary": summary}).eq("id", run_id).execute()

    if findings:
        for f in findings:
            f = dict(f)
            f["run_id"] = run_id
            sb.table("analysis_findings").insert(f).execute()


def _clone_repo(repo_url: str, ref: str | None) -> Path:
    tmpdir = Path(tempfile.mkdtemp(prefix="aca_"))
    # Shallow clone para reduzir custo no serverless
    clone_url = _auth_repo_url_if_needed(repo_url)
    repo = Repo.clone_from(clone_url, tmpdir.as_posix(), depth=1)
    if ref:
        repo.git.fetch("--depth", "1", "origin", ref)
        repo.git.checkout(ref)
    return tmpdir


def analyze_repo(
    repo_url: str | None = None,
    owner: str | None = None,
    repo: str | None = None,
    ref: str | None = None,
    triggered_by: str = "manual",
):
    if repo_url is None and owner is None and repo is None:
        # Modo cron: lista repos no banco
        repos = _list_repos_to_analyze()
        results = []
        for r in repos:
            results.append(analyze_repo(repo_url=r, ref=ref, triggered_by=triggered_by))
        return {"ok": True, "mode": "cron", "count": len(results), "results": results}

    norm_url = _normalize_repo_url(repo_url, owner, repo)
    if not norm_url:
        return {"ok": False, "error": "repo não informado"}

    run_id = _insert_run(norm_url, ref, triggered_by)

    checkout_dir: Path | None = None
    status = "success"
    findings: list[dict] = []
    summary: dict = {
        "started_at": datetime.now(timezone.utc).isoformat(),
        "repo_url": norm_url,
        "ref": ref,
    }

    try:
        gh = _parse_github_owner_repo(norm_url)
        if gh:
            owner2, repo2 = gh
            ga = run_github_actions_checks(owner2, repo2)
            summary.update(ga.get("summary", {}))
            findings.extend(ga.get("findings", []))

        checkout_dir = _clone_repo(norm_url, ref)
        basic = run_basic_checks(checkout_dir, max_files=settings.analysis_max_files, max_bytes=settings.analysis_max_bytes)
        summary.update(basic.get("summary", {}))
        findings.extend(basic.get("findings", []))
    except Exception as e:  # noqa: BLE001
        status = "error"
        findings.append(
            {
                "severity": "high",
                "code": "ANALYSIS_EXCEPTION",
                "message": _redact_secrets(str(e)),
                "path": None,
                "line": None,
                "meta": {},
            }
        )
    finally:
        summary["finished_at"] = datetime.now(timezone.utc).isoformat()
        summary["status"] = status
        if checkout_dir and checkout_dir.exists():
            shutil.rmtree(checkout_dir, ignore_errors=True)

        if run_id is not None:
            _finish_run(run_id, status, summary, findings)

    # Para resposta HTTP: inclui um preview dos achados; o full já fica no Supabase quando configurado.
    preview = findings[:50]
    return {
        "ok": status == "success",
        "repo_url": norm_url,
        "ref": ref,
        "status": status,
        "summary": summary,
        "findings_count": len(findings),
        "findings_preview": preview,
    }
