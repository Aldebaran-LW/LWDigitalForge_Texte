# ========================================
# Script para Deploy da Edge Function
# LWDIGITALFORGE - Mercado Pago Webhook
# ========================================

Write-Host "`n🚀 Iniciando deploy da Edge Function mercadopago-webhook...`n" -ForegroundColor Cyan

# Verificar se Supabase CLI está instalado
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseInstalled) {
    Write-Host "❌ Supabase CLI não encontrado!" -ForegroundColor Red
    Write-Host "`n📦 Instale com: npm install -g supabase`n" -ForegroundColor Yellow
    exit 1
}

# Verificar se está no diretório correto
if (-not (Test-Path "supabase\functions\mercadopago-webhook\index.ts")) {
    Write-Host "❌ Arquivo da Edge Function não encontrado!" -ForegroundColor Red
    Write-Host "   Certifique-se de estar no diretório raiz do projeto.`n" -ForegroundColor Yellow
    exit 1
}

# Verificar se está logado
Write-Host "🔍 Verificando autenticação...`n" -ForegroundColor Yellow
$loginCheck = supabase projects list 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Parece que você não está logado no Supabase CLI" -ForegroundColor Yellow
    Write-Host "`n🔐 Execute: supabase login`n" -ForegroundColor Cyan
    $continue = Read-Host "Deseja continuar mesmo assim? (s/N)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 1
    }
}

# Fazer deploy
Write-Host "📤 Fazendo deploy da função mercadopago-webhook...`n" -ForegroundColor Cyan

try {
    supabase functions deploy mercadopago-webhook
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Deploy realizado com sucesso!`n" -ForegroundColor Green
        
        Write-Host "📝 Próximos passos:`n" -ForegroundColor Yellow
        Write-Host "1. Configure os secrets da função:" -ForegroundColor White
        Write-Host "   supabase secrets set MERCADOPAGO_ACCESS_TOKEN=seu_token" -ForegroundColor Cyan
        Write-Host "   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=sua_key`n" -ForegroundColor Cyan
        
        Write-Host "2. URL da função:" -ForegroundColor White
        Write-Host "   https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/mercadopago-webhook`n" -ForegroundColor Cyan
        
        Write-Host "3. Configure o webhook no Mercado Pago com a URL acima.`n" -ForegroundColor White
    } else {
        Write-Host "`n❌ Erro durante o deploy. Verifique os logs acima.`n" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "`n❌ Erro ao executar deploy: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}




