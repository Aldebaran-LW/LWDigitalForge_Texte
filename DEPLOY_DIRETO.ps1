# ========================================
# Script PowerShell para Deploy DIRETO
# Ignora .env e faz deploy direto
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploy DIRETO da Edge Function" -ForegroundColor Cyan
Write-Host "check-subscription" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configurar o token
$env:SUPABASE_ACCESS_TOKEN = "sbp_17044a0c34e1a5bb6157319ea867e094c6ae0a12"
$env:SUPABASE_IGNORE_ENV = "true"

Write-Host "Token configurado." -ForegroundColor Green
Write-Host "Ignorando arquivo .env..." -ForegroundColor Yellow
Write-Host ""

# Fazer deploy DIRETO com project-ref (sem link)
Write-Host "Fazendo deploy DIRETO da funcao..." -ForegroundColor Yellow
Write-Host "(Usando project-ref diretamente, sem link)" -ForegroundColor Gray
Write-Host ""

try {
    # Deploy direto com project-ref
    $result = npx supabase functions deploy check-subscription --project-ref wwwwyuwighdehmvnolrl 2>&1
    
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
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "ERRO: Falha no deploy." -ForegroundColor Red
        Write-Host "Saida do comando:" -ForegroundColor Yellow
        Write-Host $result -ForegroundColor Gray
        Write-Host ""
        Write-Host "Tentando metodo alternativo..." -ForegroundColor Yellow
        
        # Tentar sem project-ref (se já estiver linkado)
        $result2 = npx supabase functions deploy check-subscription 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "SUCESSO: Deploy realizado!" -ForegroundColor Green
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

