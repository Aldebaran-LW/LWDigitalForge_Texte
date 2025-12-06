-- Script para gerar INSERT statements de todas as tabelas
-- Execute no banco de PRODUÇÃO e copie os resultados para o banco de DESENVOLVIMENTO

-- ========================================
-- 1. registered_apps
-- ========================================
SELECT 
    'INSERT INTO registered_apps (id, name, description, detailed_description, image_url, price_monthly, price_annual, price_lifetime, is_active, category, features, download_url, documentation_url, created_at, updated_at) VALUES (' ||
    quote_literal(id::text) || ', ' ||
    quote_literal(name) || ', ' ||
    COALESCE(quote_literal(description), 'NULL') || ', ' ||
    COALESCE(quote_literal(detailed_description), 'NULL') || ', ' ||
    COALESCE(quote_literal(image_url), 'NULL') || ', ' ||
    COALESCE(price_monthly::text, 'NULL') || ', ' ||
    COALESCE(price_annual::text, 'NULL') || ', ' ||
    COALESCE(price_lifetime::text, 'NULL') || ', ' ||
    is_active::text || ', ' ||
    COALESCE(quote_literal(category), 'NULL') || ', ' ||
    COALESCE(quote_literal(features::text), '''[]''') || ', ' ||
    COALESCE(quote_literal(download_url), 'NULL') || ', ' ||
    COALESCE(quote_literal(documentation_url), 'NULL') || ', ' ||
    quote_literal(created_at::text) || ', ' ||
    quote_literal(updated_at::text) ||
    ');' as insert_statement
FROM registered_apps;

-- ========================================
-- 2. user_purchases
-- ========================================
SELECT 
    'INSERT INTO user_purchases (id, user_id, app_id, purchase_type, amount_paid, payment_method, payment_id, status, expires_at, created_at, updated_at) VALUES (' ||
    quote_literal(id::text) || ', ' ||
    quote_literal(user_id::text) || ', ' ||
    COALESCE(quote_literal(app_id::text), 'NULL') || ', ' ||
    quote_literal(purchase_type) || ', ' ||
    amount_paid::text || ', ' ||
    COALESCE(quote_literal(payment_method), 'NULL') || ', ' ||
    COALESCE(quote_literal(payment_id), 'NULL') || ', ' ||
    quote_literal(status) || ', ' ||
    COALESCE(quote_literal(expires_at::text), 'NULL') || ', ' ||
    quote_literal(created_at::text) || ', ' ||
    quote_literal(updated_at::text) ||
    ');' as insert_statement
FROM user_purchases;

-- ========================================
-- 3. user_trials
-- ========================================
SELECT 
    'INSERT INTO user_trials (id, user_id, app_id, started_at, expires_at, is_active, created_at) VALUES (' ||
    quote_literal(id::text) || ', ' ||
    quote_literal(user_id::text) || ', ' ||
    quote_literal(app_id::text) || ', ' ||
    quote_literal(started_at::text) || ', ' ||
    quote_literal(expires_at::text) || ', ' ||
    is_active::text || ', ' ||
    quote_literal(created_at::text) ||
    ');' as insert_statement
FROM user_trials;

-- ========================================
-- 4. profiles (se necessário)
-- ========================================
SELECT 
    'INSERT INTO profiles (id, email, full_name, phone, avatar_url, role, created_at, updated_at) VALUES (' ||
    quote_literal(id::text) || ', ' ||
    quote_literal(email) || ', ' ||
    COALESCE(quote_literal(full_name), 'NULL') || ', ' ||
    COALESCE(quote_literal(phone), 'NULL') || ', ' ||
    COALESCE(quote_literal(avatar_url), 'NULL') || ', ' ||
    quote_literal(role) || ', ' ||
    quote_literal(created_at::text) || ', ' ||
    quote_literal(updated_at::text) ||
    ');' as insert_statement
FROM profiles;

-- ========================================
-- 5. products (se existir)
-- ========================================
-- Descomente se a tabela products existir
/*
SELECT 
    'INSERT INTO products (...) VALUES (...);' as insert_statement
FROM products;
*/

-- ========================================
-- 6. production_orders (se existir)
-- ========================================
-- Descomente se a tabela production_orders existir
/*
SELECT 
    'INSERT INTO production_orders (...) VALUES (...);' as insert_statement
FROM production_orders;
*/

-- ========================================
-- 7. requests (se existir)
-- ========================================
-- Descomente se a tabela requests existir
/*
SELECT 
    'INSERT INTO requests (...) VALUES (...);' as insert_statement
FROM requests;
*/
