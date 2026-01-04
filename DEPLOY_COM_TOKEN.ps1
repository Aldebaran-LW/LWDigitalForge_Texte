# ========================================
# Script para Deploy com Token Manual
# LWDIGITALFORGE - Check Subscription
# ========================================

Write-Host "`nDeploy da Edge Function check-subscription`n" -ForegroundColor Cyan

# Solicitar o Access Token
Write-Host "Para fazer o deploy, voce precisa do Access Token do Supabase" -ForegroundColor Yellow
Write-Host "Obtenha em: https://supabase.com/dashboard/account/tokens`n" -ForegroundColor Cyan

$token = Read-Host "Cole seu SUPABASE_ACCESS_TOKEN aqui"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "`nERRO: Token nao fornecido. Deploy cancelado.`n" -ForegroundColor Red
    exit 1
}

# Validar formato do token
if (-not $token.StartsWith("sbp_")) {
    Write-Host "`nERRO: Formato de token invalido!" -ForegroundColor Red
    Write-Host "`nO token que voce colou comeca com: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Yellow
    
    if ($token.StartsWith("sb_publishable_")) {
        Write-Host "`nIsso e um PUBLISHABLE KEY (para frontend), nao para deploy!" -ForegroundColor Red
    } elseif ($token.StartsWith("sb_secret_")) {
        Write-Host "`nIsso e um SECRET KEY, nao o Access Token do CLI!" -ForegroundColor Red
    } elseif ($token.StartsWith("eyJ")) {
        Write-Host "`nIsso e um ANON KEY (JWT), nao o Access Token do CLI!" -ForegroundColor Red
    }
    
    Write-Host "`nO token CORRETO deve comecar com 'sbp_' (3 letras apenas)" -ForegroundColor Yellow
    Write-Host "Exemplo: sbp_0102030405060708091011121314151617181920" -ForegroundColor Cyan
    Write-Host "`nObtenha o token correto em: https://supabase.com/dashboard/account/tokens" -ForegroundColor Cyan
    Write-Host "Procure por 'Personal Access Tokens' ou 'Access Tokens'" -ForegroundColor Cyan
    Write-Host "Clique em 'Generate New Token' e copie o token que comeca com 'sbp_'`n" -ForegroundColor Cyan
    exit 1
}

# Configurar variavel de ambiente
$env:SUPABASE_ACCESS_TOKEN = $token

Write-Host "`nFazendo deploy...`n" -ForegroundColor Cyan

try {
    npx supabase functions deploy check-subscription
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nSUCESSO: Deploy realizado com sucesso!`n" -ForegroundColor Green
        
        Write-Host "Informacoes da funcao:`n" -ForegroundColor Yellow
        Write-Host "URL: https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1/check-subscription" -ForegroundColor Cyan
        Write-Host "`nProximo passo: Testar a funcao`n" -ForegroundColor Yellow
        Write-Host "   npm run test:check-subscription:prod" -ForegroundColor Cyan
    } else {
        Write-Host "`nERRO: Erro durante o deploy. Verifique os logs acima.`n" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "`nERRO: Erro ao executar deploy: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
} finally {
    # Limpar token da memoria
    $env:SUPABASE_ACCESS_TOKEN = $null
    Write-Host "`nToken removido da memoria.`n" -ForegroundColor Green
}
