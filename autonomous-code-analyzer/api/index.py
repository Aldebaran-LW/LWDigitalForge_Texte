from fastapi import FastAPI, Header, HTTPException

from app.settings import settings
from app.jobs.analyze_repo import analyze_repo

app = FastAPI(title="Autonomous Code Analyzer")


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/analyze")
def analyze(payload: dict):
    """Trigger manual: {"repo_url": "https://github.com/org/repo"} or {"owner":"org","repo":"repo"}"""
    repo_url = payload.get("repo_url")
    owner = payload.get("owner")
    repo = payload.get("repo")
    ref = payload.get("ref")

    if not repo_url and (not owner or not repo):
        raise HTTPException(status_code=400, detail="Informe repo_url ou owner+repo")

    return analyze_repo(repo_url=repo_url, owner=owner, repo=repo, ref=ref, triggered_by="manual")


@app.post("/api/cron/analyze")
def cron_analyze(x_cron_secret: str | None = Header(default=None, alias="x-cron-secret")):
    if settings.cron_shared_secret and x_cron_secret != settings.cron_shared_secret:
        raise HTTPException(status_code=401, detail="unauthorized")

    # Estratégia inicial: você controla quais repos analisar via tabela no Supabase.
    # Se não existir/configurar ainda, faz no-op seguro.
    return analyze_repo(triggered_by="cron")
