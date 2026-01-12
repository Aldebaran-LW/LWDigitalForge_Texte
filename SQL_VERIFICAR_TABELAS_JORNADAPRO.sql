-- ========================================
-- Verificação de Dados JornadaPro (Antes de Excluir)
-- ========================================
-- Execute estas queries para verificar os dados antes de excluir as tabelas
-- ========================================

-- 1. CONTAGEM DE REGISTROS EM CADA TABELA
SELECT 'Apontamentos_Fabrica' AS tabela, COUNT(*) AS total FROM public.Apontamentos_Fabrica
UNION ALL
SELECT 'Apontamentos_Viagem', COUNT(*) FROM public.Apontamentos_Viagem
UNION ALL
SELECT 'Empresas', COUNT(*) FROM public.Empresas
UNION ALL
SELECT 'Funcionarios', COUNT(*) FROM public.Funcionarios
UNION ALL
SELECT 'Feriados', COUNT(*) FROM public.Feriados
UNION ALL
SELECT 'Relatorios_Mensais', COUNT(*) FROM public.Relatorios_Mensais
UNION ALL
SELECT 'Logs_Erros', COUNT(*) FROM public.Logs_Erros
ORDER BY tabela;

-- 2. VERIFICAR FOREIGN KEYS E DEPENDÊNCIAS
SELECT 
    tc.table_name AS tabela_dependente, 
    kcu.column_name AS coluna,
    ccu.table_name AS tabela_referenciada,
    ccu.column_name AS coluna_referenciada
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND (
    ccu.table_name IN ('Apontamentos_Fabrica', 'Apontamentos_Viagem', 'Empresas', 'Funcionarios', 'Feriados', 'Relatorios_Mensais', 'Logs_Erros')
    OR tc.table_name IN ('Apontamentos_Fabrica', 'Apontamentos_Viagem', 'Empresas', 'Funcionarios', 'Feriados', 'Relatorios_Mensais', 'Logs_Erros')
  )
ORDER BY tc.table_name, ccu.table_name;

-- 3. VERIFICAR SE EXISTEM DADOS RECENTES (últimos 30 dias)
SELECT 'Apontamentos_Fabrica' AS tabela, COUNT(*) AS total_ultimos_30_dias
FROM public.Apontamentos_Fabrica
WHERE created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT 'Apontamentos_Viagem', COUNT(*)
FROM public.Apontamentos_Viagem
WHERE created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT 'Empresas', COUNT(*)
FROM public.Empresas
WHERE created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT 'Funcionarios', COUNT(*)
FROM public.Funcionarios
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY tabela;

-- 4. VERIFICAR ESTRUTURA DAS TABELAS (para documentação)
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'Apontamentos_Fabrica',
    'Apontamentos_Viagem',
    'Empresas',
    'Funcionarios',
    'Feriados',
    'Relatorios_Mensais',
    'Logs_Erros'
  )
ORDER BY table_name, ordinal_position;

-- 5. VERIFICAR ÚLTIMA ATUALIZAÇÃO EM CADA TABELA
SELECT 
    'Apontamentos_Fabrica' AS tabela,
    MAX(updated_at) AS ultima_atualizacao,
    MAX(created_at) AS ultimo_cadastro
FROM public.Apontamentos_Fabrica
UNION ALL
SELECT 'Apontamentos_Viagem', MAX(updated_at), MAX(created_at)
FROM public.Apontamentos_Viagem
UNION ALL
SELECT 'Empresas', MAX(updated_at), MAX(created_at)
FROM public.Empresas
UNION ALL
SELECT 'Funcionarios', MAX(updated_at), MAX(created_at)
FROM public.Funcionarios
UNION ALL
SELECT 'Relatorios_Mensais', MAX(created_at), MAX(created_at)
FROM public.Relatorios_Mensais
ORDER BY tabela;
