from __future__ import annotations

import httpx

from app.settings import settings


def run_github_actions_checks(owner: str, repo: str):
    """Coleta falhas recentes do GitHub Actions (se houver token).

    Observação: sem GITHUB_TOKEN, normalmente repos privados não serão acessíveis.
    """
    if not settings.github_token:
        return {"summary": {}, "findings": []}

    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {settings.github_token}",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "autonomous-code-analyzer",
    }

    findings: list[dict] = []
    summary: dict = {}

    url = f"https://api.github.com/repos/{owner}/{repo}/actions/runs"
    try:
        with httpx.Client(timeout=20.0, headers=headers) as client:
            r = client.get(url, params={"per_page": 15})
            if r.status_code == 404:
                # Sem acesso / repo não existe
                return {"summary": {}, "findings": []}
            r.raise_for_status()
            data = r.json() or {}
    except Exception:  # noqa: BLE001
        return {"summary": {}, "findings": []}

    runs = data.get("workflow_runs") or []
    failed = 0
    for run in runs:
        conclusion = (run.get("conclusion") or "").lower()
        status = (run.get("status") or "").lower()
        if status != "completed":
            continue
        if conclusion in {"failure", "cancelled", "timed_out", "action_required"}:
            failed += 1
            findings.append(
                {
                    "severity": "high" if conclusion == "failure" else "medium",
                    "code": "GITHUB_ACTIONS_RUN_FAILED",
                    "message": f"GitHub Actions: {run.get('name') or 'workflow'} ({conclusion})",
                    "path": None,
                    "line": None,
                    "meta": {
                        "html_url": run.get("html_url"),
                        "run_number": run.get("run_number"),
                        "workflow_id": run.get("workflow_id"),
                        "head_branch": run.get("head_branch"),
                        "head_sha": run.get("head_sha"),
                        "created_at": run.get("created_at"),
                        "updated_at": run.get("updated_at"),
                    },
                }
            )

    if failed:
        summary["github_actions_failed_recent_runs"] = failed

    return {"summary": summary, "findings": findings}

