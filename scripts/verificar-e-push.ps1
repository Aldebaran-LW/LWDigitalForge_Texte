# Script para verificar e fazer push da branch feat/supabase-registered-apps-integration

Write-Host "🔍 Verificando status do repositório..." -ForegroundColor Cyan

# Verificar branch atual
Write-Host "`n📋 Branch atual:" -ForegroundColor Yellow
git branch --show-current

# Verificar status
Write-Host "`n📋 Status do repositório:" -ForegroundColor Yellow
git status

# Verificar remote
Write-Host "`n📋 Remote configurado:" -ForegroundColor Yellow
git remote -v

# Verificar commits locais não enviados
Write-Host "`n📋 Commits locais não enviados:" -ForegroundColor Yellow
$unpushed = git log origin/feat/supabase-registered-apps-integration..HEAD --oneline 2>$null
if ($unpushed) {
    Write-Host $unpushed -ForegroundColor Green
} else {
    Write-Host "Nenhum commit local não enviado encontrado." -ForegroundColor Gray
}

# Verificar se está na branch correta
$currentBranch = git branch --show-current
if ($currentBranch -ne "feat/supabase-registered-apps-integration") {
    Write-Host "`n⚠️  Você não está na branch feat/supabase-registered-apps-integration" -ForegroundColor Red
    Write-Host "Mudando para a branch correta..." -ForegroundColor Yellow
    git checkout feat/supabase-registered-apps-integration
}

# Verificar se há mudanças não commitadas
$status = git status --porcelain
if ($status) {
    Write-Host "`n📝 Há arquivos modificados. Deseja fazer commit? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "S" -or $response -eq "s") {
        Write-Host "Adicionando arquivos..." -ForegroundColor Cyan
        git add .
        Write-Host "Fazendo commit..." -ForegroundColor Cyan
        git commit -m "docs: adicionar documentação sobre configuração de token GitHub e atualizar .gitignore"
    }
}

# Tentar fazer push
Write-Host "`n🚀 Fazendo push para origin/feat/supabase-registered-apps-integration..." -ForegroundColor Cyan
git push -v origin feat/supabase-registered-apps-integration

# Verificar resultado
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Push realizado com sucesso!" -ForegroundColor Green
    Write-Host "`n🔗 Verifique no GitHub:" -ForegroundColor Cyan
    Write-Host "https://github.com/Aldebaran-LW/LWDigitalForge_Texte/tree/feat/supabase-registered-apps-integration" -ForegroundColor Blue
} else {
    Write-Host "`n❌ Erro ao fazer push. Código de saída: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "`n💡 Dicas:" -ForegroundColor Yellow
    Write-Host "1. Verifique se o token está correto" -ForegroundColor White
    Write-Host "2. Tente: git push -u origin feat/supabase-registered-apps-integration" -ForegroundColor White
    Write-Host "3. Verifique as credenciais do Git" -ForegroundColor White
}

Write-Host "`n✅ Verificação concluída!" -ForegroundColor Green
