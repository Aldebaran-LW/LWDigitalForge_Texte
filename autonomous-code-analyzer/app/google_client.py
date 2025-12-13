from __future__ import annotations

import json

from google.oauth2 import service_account

from app.settings import settings


def get_google_credentials(scopes: list[str] | None = None):
    """Retorna credenciais Google de forma segura.

    Preferência:
    - GOOGLE_APPLICATION_CREDENTIALS_JSON (JSON inteiro)
    - GOOGLE_APPLICATION_CREDENTIALS (path)

    Não faz chamadas externas aqui; só constrói credenciais.
    """
    scopes = scopes or ["https://www.googleapis.com/auth/cloud-platform"]

    if settings.google_application_credentials_json:
        info = json.loads(settings.google_application_credentials_json)
        return service_account.Credentials.from_service_account_info(info, scopes=scopes)

    if settings.google_application_credentials:
        return service_account.Credentials.from_service_account_file(settings.google_application_credentials, scopes=scopes)

    return None
