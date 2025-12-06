# Script PowerShell para verificar configuração da branch do Supabase

Write-Host "🔍 Verificando configuração da branch do Supabase..." -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = "wwwwyuwighdehmvnolrl"
$BRANCH_NAME = "feat-supabase-registered-apps-integration"

# Verificar se Supabase CLI está instalado
Write-Host "📋 Verificando Supabase CLI..." -ForegroundColor Yellow

$supabaseInstalled = $false
if (Get-Command supabase -ErrorAction SilentlyContinue) {
    Write-Host "✅ Supabase CLI encontrado" -ForegroundColor Green
    $supabaseInstalled = $true
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Host "⚠️ Supabase CLI não encontrado globalmente, mas npx está disponível" -ForegroundColor Yellow
    Write-Host "   Você pode usar: npx supabase <comando>" -ForegroundColor Yellow
    $supabaseInstalled = $false
} else {
    Write-Host "❌ Supabase CLI não encontrado" -ForegroundColor Red
    Write-Host "   Instale com: npm install -g supabase" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Verificando arquivos de configuração local..." -ForegroundColor Yellow
Write-Host ""

# Verificar .env.local
if (Test-Path ".env.local") {
    Write-Host "✅ Arquivo .env.local encontrado" -ForegroundColor Green
    
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "VITE_SUPABASE_URL_DEV") {
        Write-Host "✅ VITE_SUPABASE_URL_DEV configurado" -ForegroundColor Green
    } else {
        Write-Host "⚠️ VITE_SUPABASE_URL_DEV não encontrado em .env.local" -ForegroundColor Yellow
    }
    
    if ($envContent -match "VITE_SUPABASE_ANON_KEY_DEV") {
        Write-Host "✅ VITE_SUPABASE_ANON_KEY_DEV configurado" -ForegroundColor Green
    } else {
        Write-Host "⚠️ VITE_SUPABASE_ANON_KEY_DEV não encontrado em .env.local" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ Arquivo .env.local não encontrado" -ForegroundColor Yellow
    Write-Host "   (Isso é normal se você não está desenvolvendo localmente)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📋 Verificando workflows..." -ForegroundColor Yellow
Write-Host ""

# Verificar workflows
if (Test-Path ".github/workflows/supabase-branch-deploy.yml") {
    Write-Host "✅ Workflow de branch encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Workflow de branch não encontrado" -ForegroundColor Red
}

if (Test-Path ".github/workflows/vercel_deploy.yml") {
    Write-Host "✅ Workflow do Vercel encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Workflow do Vercel não encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Checklist de Configuração:" -ForegroundColor Cyan
Write-Host ""
Write-Host "No Supabase Dashboard:" -ForegroundColor Yellow
Write-Host "  [ ] Branch criada: $BRANCH_NAME" -ForegroundColor White
Write-Host "  [ ] Credenciais da branch anotadas (URL e anon key)" -ForegroundColor White
Write-Host ""
Write-Host "No GitHub (Settings → Secrets and variables → Actions):" -ForegroundColor Yellow
Write-Host "  [ ] VITE_SUPABASE_URL_DEV configurado" -ForegroundColor White
Write-Host "  [ ] VITE_SUPABASE_ANON_KEY_DEV configurado" -ForegroundColor White
Write-Host "  [ ] SUPABASE_BRANCH_ID configurado (opcional)" -ForegroundColor White
Write-Host ""

if ($supabaseInstalled) {
    Write-Host "💡 Para verificar branches remotas, execute:" -ForegroundColor Cyan
    Write-Host "   supabase login" -ForegroundColor Gray
    Write-Host "   supabase branches list --project-ref $PROJECT_ID" -ForegroundColor Gray
} else {
    Write-Host "💡 Para verificar branches remotas:" -ForegroundColor Cyan
    Write-Host "   1. Instale o Supabase CLI: npm install -g supabase" -ForegroundColor Gray
    Write-Host "   2. Execute: supabase login" -ForegroundColor Gray
    Write-Host "   3. Execute: supabase branches list --project-ref $PROJECT_ID" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Verificação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Documentação:" -ForegroundColor Cyan
Write-Host "   - CONFIGURACAO_RAPIDA.md - Guia rápido de configuração" -ForegroundColor Gray
Write-Host "   - CONFIGURACAO_BRANCHES_PASSO_A_PASSO.md - Guia detalhado" -ForegroundColor Gray
