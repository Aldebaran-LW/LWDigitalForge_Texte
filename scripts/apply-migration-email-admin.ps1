# Script PowerShell para aplicar migracao de correcao de email admin
# Este script e SEGURO e nao modifica dados, apenas ajusta politicas RLS

Write-Host ""
Write-Host "Aplicando Migracao: Fix Admin Email Access" -ForegroundColor Cyan
Write-Host ("-" * 60) -ForegroundColor Cyan

# Caminho do arquivo de migracao
$migrationPath = Join-Path $PSScriptRoot "..\supabase\migrations\20250110000000_fix_admin_email_access.sql"

if (-not (Test-Path $migrationPath)) {
    Write-Host ""
    Write-Host "Erro: Arquivo de migracao nao encontrado!" -ForegroundColor Red
    Write-Host "   Caminho esperado: $migrationPath" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Arquivo de migracao encontrado" -ForegroundColor Green
Write-Host "   $migrationPath" -ForegroundColor Gray

# Ler o conteudo do SQL
$sqlContent = Get-Content $migrationPath -Raw

Write-Host ""
Write-Host "Conteudo da migracao:" -ForegroundColor Blue
Write-Host ("-" * 60) -ForegroundColor Gray
Write-Host $sqlContent -ForegroundColor White
Write-Host ("-" * 60) -ForegroundColor Gray

Write-Host ""
Write-Host "ATENCAO: Esta migracao e SEGURA porque:" -ForegroundColor Yellow
Write-Host "   - Usa DROP IF EXISTS (nao quebra se nao existir)" -ForegroundColor Green
Write-Host "   - Usa CREATE OR REPLACE (idempotente)" -ForegroundColor Green
Write-Host "   - Nao remove dados, apenas ajusta politicas RLS" -ForegroundColor Green
Write-Host "   - Mantem seguranca: usuarios normais so veem seus proprios perfis" -ForegroundColor Green

Write-Host ""
Write-Host "Opcoes para aplicar a migracao:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Via Supabase Dashboard (RECOMENDADO):" -ForegroundColor Yellow
Write-Host "   a) Acesse: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "   b) Selecione seu projeto" -ForegroundColor White
Write-Host "   c) Va em SQL Editor > New Query" -ForegroundColor White
Write-Host "   d) Cole o SQL acima e execute (Ctrl+Enter)" -ForegroundColor White
Write-Host ""
Write-Host "2. Via Supabase CLI (se instalado):" -ForegroundColor Yellow
Write-Host "   supabase db push" -ForegroundColor White
Write-Host ""

# Verificar se Supabase CLI esta instalado
$supabaseCli = Get-Command supabase -ErrorAction SilentlyContinue
if ($supabaseCli) {
    Write-Host "Supabase CLI encontrado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Deseja aplicar a migracao via CLI agora? (S/N)" -ForegroundColor Cyan
    $response = Read-Host
    
    if ($response -eq "S" -or $response -eq "s" -or $response -eq "Y" -or $response -eq "y") {
        Write-Host ""
        Write-Host "Aplicando migracao via Supabase CLI..." -ForegroundColor Blue
        Push-Location (Split-Path $migrationPath -Parent -Parent)
        try {
            supabase db push
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "Migracao aplicada com sucesso!" -ForegroundColor Green
            } else {
                Write-Host ""
                Write-Host "Erro ao aplicar migracao. Tente via Dashboard." -ForegroundColor Yellow
            }
        } catch {
            Write-Host ""
            Write-Host "Erro: $_" -ForegroundColor Red
        } finally {
            Pop-Location
        }
    }
} else {
    Write-Host "Supabase CLI nao encontrado. Use a opcao 1 (Dashboard)." -ForegroundColor Gray
}

Write-Host ""
Write-Host "Para copiar o SQL, o arquivo esta em:" -ForegroundColor Cyan
Write-Host "   $migrationPath" -ForegroundColor White
Write-Host ""
Write-Host "Processo concluido!" -ForegroundColor Green
