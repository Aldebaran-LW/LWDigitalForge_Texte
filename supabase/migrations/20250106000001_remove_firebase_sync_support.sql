-- ========================================
-- REMOVER: Sincronização com Firebase Auth
-- Migration criada em: 2025-01-06
-- ========================================
-- 
-- Esta migration remove o suporte para sincronização
-- com Firebase Auth que foi adicionado anteriormente.
-- 
-- Execute esta migration se você já executou a migration
-- 20250106000000_add_firebase_sync_support.sql
-- ========================================

-- Remover colunas de sincronização com Firebase
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS firebase_synced_at,
DROP COLUMN IF EXISTS firebase_uid;

-- Remover índice
DROP INDEX IF EXISTS idx_profiles_firebase_uid;

-- Remover função auxiliar
DROP FUNCTION IF EXISTS public.mark_profile_firebase_synced(UUID, TEXT);

-- ========================================
-- Migration concluída
-- ========================================

