-- ========================================
-- REMOVER TABELAS JORNADAPRO (APÓS CONFIRMAÇÃO)
-- ========================================
-- ⚠️ ATENÇÃO: Execute APENAS após confirmar que:
--   1. ✅ Todos os dados foram migrados para MongoDB
--   2. ✅ Aplicação está funcionando corretamente
--   3. ✅ Backup foi criado
--   4. ✅ Testes completos foram realizados
-- ========================================
-- ORDEM IMPORTANTE: Excluir primeiro as tabelas dependentes
-- ========================================

-- 1. EXCLUIR TABELAS DEPENDENTES PRIMEIRO
DROP TABLE IF EXISTS public.Logs_Erros CASCADE;
DROP TABLE IF EXISTS public.Relatorios_Mensais CASCADE;
DROP TABLE IF EXISTS public.Apontamentos_Fabrica CASCADE;
DROP TABLE IF EXISTS public.Apontamentos_Viagem CASCADE;
DROP TABLE IF EXISTS public.Feriados CASCADE;

-- 2. EXCLUIR TABELAS PRINCIPAIS
DROP TABLE IF EXISTS public.Funcionarios CASCADE;
DROP TABLE IF EXISTS public.Empresas CASCADE;

-- ========================================
-- VERIFICAÇÃO (Após exclusão)
-- ========================================

-- Verificar se as tabelas foram excluídas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'Apontamentos_Fabrica',
    'Apontamentos_Viagem',
    'Empresas',
    'Funcionarios',
    'Feriados',
    'Relatorios_Mensais',
    'Logs_Erros'
  );

-- Resultado esperado: Nenhuma linha retornada (todas excluídas)
