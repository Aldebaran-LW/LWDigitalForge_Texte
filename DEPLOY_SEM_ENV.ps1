# ========================================
# Script PowerShell para Deploy
# Renomeia .env temporariamente para evitar erro
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploy da Edge Function check-subscription" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configurar o token
$env:SUPABASE_ACCESS_TOKEN = "sbp_17044a0c34e1a5bb6157319ea867e094c6ae0a12"

Write-Host "Token configurado." -ForegroundColor Green
Write-Host ""

# Verificar se .env existe e renomear temporariamente
$envBackup = $false
if (Test-Path ".env") {
    Write-Host "Arquivo .env encontrado. Renomeando temporariamente..." -ForegroundColor Yellow
    Rename-Item ".env" ".env.backup" -ErrorAction SilentlyContinue
    $envBackup = $true
    Write-Host "Arquivo .env renomeado para .env.backup" -ForegroundColor Green
    Write-Host ""
}

try {
    # Fazer deploy (sem verificação JWT, conforme especificação)
    Write-Host "Fazendo deploy da funcao..." -ForegroundColor Yellow
    Write-Host "(Sem verificacao JWT - conforme especificacao)" -ForegroundColor Gray
    Write-Host ""
    
    $result = npx supabase functions deploy check-subscription --project-ref wwwwyuwighdehmvnolrl --no-verify-jwt 2>&1
    
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
        Write-Host "Saida: $result" -ForegroundColor Gray
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Restaurar .env se foi renomeado
    if ($envBackup -and (Test-Path ".env.backup")) {
        Write-Host "Restaurando arquivo .env..." -ForegroundColor Yellow
        Rename-Item ".env.backup" ".env" -ErrorAction SilentlyContinue
        Write-Host "Arquivo .env restaurado." -ForegroundColor Green
    }
}

Write-Host ""

