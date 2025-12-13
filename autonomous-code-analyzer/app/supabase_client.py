from __future__ import annotations

from supabase import create_client, Client

from app.settings import settings


def get_supabase() -> Client | None:
    if not settings.supabase_url or not settings.supabase_service_role_key:
        return None
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
