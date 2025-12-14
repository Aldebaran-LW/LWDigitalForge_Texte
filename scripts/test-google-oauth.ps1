# Script PowerShell para testar autenticação Google OAuth
# Execute: .\scripts\test-google-oauth.ps1

Write-Host "`n🧪 TESTES: Autenticação Google OAuth`n" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Blue

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo .env existe
if (Test-Path ".env") {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Arquivo .env não encontrado" -ForegroundColor Yellow
    Write-Host "   Certifique-se de que as variáveis de ambiente estão configuradas" -ForegroundColor Yellow
}

# Verificar se dotenv está instalado
Write-Host "`n📦 Verificando dependências...`n" -ForegroundColor Cyan

$packageJson = Get-Content "package.json" | ConvertFrom-Json
$hasDotenv = $packageJson.dependencies.PSObject.Properties.Name -contains "dotenv" -or 
             $packageJson.devDependencies.PSObject.Properties.Name -contains "dotenv"

if (-not $hasDotenv) {
    Write-Host "⚠️  dotenv não encontrado nas dependências" -ForegroundColor Yellow
    Write-Host "   Instalando dotenv..." -ForegroundColor Yellow
    npm install dotenv --save-dev
}

# Executar testes
Write-Host "`n🚀 Executando testes...`n" -ForegroundColor Cyan
Write-Host "-" * 60 -ForegroundColor Gray

try {
    npm run test:google-oauth
    Write-Host "`n✅ Testes concluídos!`n" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Erro ao executar testes: $_`n" -ForegroundColor Red
    exit 1
}

Write-Host "📝 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Revise os resultados dos testes acima" -ForegroundColor White
Write-Host "2. Execute os testes manuais descritos em TESTES_GOOGLE_OAUTH.md" -ForegroundColor White
Write-Host "3. Configure o Google OAuth seguindo CONFIGURAR_GOOGLE_OAUTH.md`n" -ForegroundColor White

