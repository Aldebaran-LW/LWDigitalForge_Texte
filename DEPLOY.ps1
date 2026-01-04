# ========================================
# Script PowerShell para Deploy
# LWDIGITALFORGE - Check Subscription
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploy da Edge Function check-subscription" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configurar o token
$env:SUPABASE_ACCESS_TOKEN = "sbp_17044a0c34e1a5bb6157319ea867e094c6ae0a12"

Write-Host "Token configurado." -ForegroundColor Green
Write-Host ""

# Fazer link do projeto
Write-Host "Fazendo link do projeto..." -ForegroundColor Yellow
try {
    $env:SUPABASE_IGNORE_ENV = "true"
    npx supabase link --project-ref wwwwyuwighdehmvnolrl 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Link concluido!" -ForegroundColor Green
    } else {
        Write-Host "AVISO: Erro ao fazer link, mas continuando..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "AVISO: Erro ao fazer link, mas continuando..." -ForegroundColor Yellow
}

Write-Host ""

# Fazer deploy
Write-Host "Fazendo deploy da funcao..." -ForegroundColor Yellow
try {
    npx supabase functions deploy check-subscription
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "SUCESSO: Deploy realizado com sucesso!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "URL da funcao:" -ForegroundColor Cyan
        Write-Host "https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription" -ForegroundColor White
        Write-Host ""
        Write-Host "Proximo passo: Testar a funcao" -ForegroundColor Yellow
        Write-Host "Execute: npm run test:check-subscription:prod" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "Tentando deploy direto com project-ref..." -ForegroundColor Yellow
        npx supabase functions deploy check-subscription --project-ref wwwwyuwighdehmvnolrl
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "SUCESSO: Deploy realizado com sucesso!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "URL da funcao:" -ForegroundColor Cyan
            Write-Host "https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription" -ForegroundColor White
        } else {
            Write-Host ""
            Write-Host "ERRO: Falha no deploy. Verifique os logs acima." -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host ""
    Write-Host "ERRO: Falha no deploy: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

