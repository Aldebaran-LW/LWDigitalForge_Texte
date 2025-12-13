from __future__ import annotations

import os
from pathlib import Path


def _iter_files(root: Path):
    for p in root.rglob("*"):
        if p.is_file():
            # ignora .git
            if ".git" in p.parts:
                continue
            yield p


def run_basic_checks(root: Path, max_files: int = 2000, max_bytes: int = 5_000_000):
    files = []
    total_bytes = 0

    for i, p in enumerate(_iter_files(root)):
        if i >= max_files:
            break
        try:
            size = p.stat().st_size
        except OSError:
            continue
        total_bytes += size
        if total_bytes > max_bytes:
            break
        files.append((p, size))

    findings: list[dict] = []

    # Heurísticas rápidas e baratas
    big = [str(p.relative_to(root)) for (p, s) in files if s > 2_000_000]
    if big:
        findings.append(
            {
                "severity": "medium",
                "code": "LARGE_FILES",
                "message": f"Arquivos muito grandes detectados: {len(big)}",
                "path": None,
                "line": None,
                "meta": {"files": big[:50]},
            }
        )

    # Busca simples por padrões comuns de segredo (heurística, não é garantia)
    secret_patterns = [
        "SUPABASE_SERVICE_ROLE_KEY",
        "SUPABASE_ANON_KEY",
        "OPENAI_API_KEY",
        "GOOGLE_APPLICATION_CREDENTIALS",
        "AWS_SECRET_ACCESS_KEY",
        "PRIVATE KEY-----",
    ]

    hits = []
    for (p, _s) in files:
        if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".webp", ".zip", ".pdf"}:
            continue
        try:
            txt = p.read_text(errors="ignore")
        except OSError:
            continue
        for pat in secret_patterns:
            if pat in txt:
                hits.append(str(p.relative_to(root)))
                break

    if hits:
        findings.append(
            {
                "severity": "high",
                "code": "POSSIBLE_SECRETS",
                "message": f"Possíveis segredos hardcoded (heurística): {len(hits)} arquivo(s)",
                "path": None,
                "line": None,
                "meta": {"files": hits[:100]},
            }
        )

    # Métricas
    exts: dict[str, int] = {}
    for (p, _s) in files:
        exts[p.suffix.lower() or "<noext>"] = exts.get(p.suffix.lower() or "<noext>", 0) + 1

    summary = {
        "files_considered": len(files),
        "bytes_considered": total_bytes,
        "top_extensions": dict(sorted(exts.items(), key=lambda kv: kv[1], reverse=True)[:20]),
    }

    return {"summary": summary, "findings": findings}
