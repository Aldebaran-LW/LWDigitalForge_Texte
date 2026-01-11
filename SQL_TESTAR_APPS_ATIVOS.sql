-- Verificar se há apps ativos
SELECT id, name, is_active 
FROM registered_apps 
WHERE is_active = true;
