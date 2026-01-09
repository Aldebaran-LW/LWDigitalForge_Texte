-- ========================================
-- Script para Verificar se a Migration foi Aplicada Corretamente
-- ========================================
-- 
-- Execute este script no SQL Editor do Supabase para verificar
-- se os campos slug e app_type foram adicionados corretamente
-- ========================================

-- 1. Verificar se a coluna 'slug' existe na tabela registered_apps
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'registered_apps' 
  AND column_name = 'slug';

-- 2. Verificar se a coluna 'app_type' existe na tabela registered_apps
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'registered_apps' 
  AND column_name = 'app_type';

-- 3. Verificar se a constraint de app_type foi criada
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public' 
  AND tc.table_name = 'registered_apps' 
  AND tc.constraint_name = 'registered_apps_app_type_check';

-- 4. Verificar se os índices foram criados
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename = 'registered_apps'
  AND (indexname LIKE '%slug%' OR indexname LIKE '%app_type%');

-- 5. Verificar o estado atual dos apps (incluindo slug e app_type)
SELECT 
    id,
    name,
    slug,
    app_type,
    is_active,
    created_at
FROM public.registered_apps
ORDER BY created_at DESC;

-- 6. Verificar especificamente o JornadaPro (se existe)
SELECT 
    id,
    name,
    slug,
    app_type,
    is_active
FROM public.registered_apps
WHERE id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'
   OR slug = 'jornadapro'
   OR name ILIKE '%jornada%';

-- ========================================
-- Resultados Esperados:
-- ========================================
-- 1. Coluna 'slug': deve existir, tipo TEXT, nullable, sem default
-- 2. Coluna 'app_type': deve existir, tipo TEXT, nullable, default 'WEB_APP'
-- 3. Constraint: deve existir com check_clause incluindo 'WEB_APP' e 'INFO_PRODUTO'
-- 4. Índices: devem existir registered_apps_slug_idx e registered_apps_app_type_idx
-- 5. Apps: devem aparecer com slug e app_type (podem estar NULL ainda)
-- 6. JornadaPro: deve ter slug='jornadapro' e app_type='WEB_APP' (se o ID estiver correto)

