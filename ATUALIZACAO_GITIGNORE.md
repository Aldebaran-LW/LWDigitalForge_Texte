# ✅ Atualização do .gitignore - Proteção de Tokens

**Data:** 10 de Janeiro de 2025

---

## 📋 Padrões Adicionados ao .gitignore

### 1. Scripts de Deploy
- `*DEPLOY*.ps1` - Todos os scripts PowerShell de deploy
- `*DEPLOY*.bat` - Todos os scripts batch de deploy
- `deploy-*.ps1` - Scripts de deploy com prefixo
- `deploy-*.bat` - Scripts de deploy batch com prefixo

### 2. Arquivos de Configuração e Secrets
- `*SECRETS*.txt` - Qualquer arquivo de texto com "SECRETS"
- `*SECRETS*.md` - Qualquer arquivo markdown com "SECRETS"
- `*CONFIGURACAO*.md` - Arquivos de configuração em markdown
- `*CONFIG*.txt` - Arquivos de configuração em texto

### 3. Tokens e Credenciais
- `*_TOKEN.txt` - Arquivos de token (maiúsculas)
- `*_SECRET.txt` - Arquivos de secret (maiúsculas)
- `*TOKEN*.txt` - Qualquer arquivo com "TOKEN"
- `*SECRET*.txt` - Qualquer arquivo com "SECRET"
- `*.key` - Arquivos de chave
- `*.secret` - Arquivos de secret
- `*credentials*` - Arquivos com "credentials"
- `*secrets*` - Arquivos com "secrets"

### 4. Documentação Sensível
- `RELATORIO_SEGURANCA*.md` - Relatórios de segurança
- `*_TOKEN*.txt` - Documentação sobre tokens
- `*_SECRET*.txt` - Documentação sobre secrets

---

## ✅ Arquivos Protegidos

O `.gitignore` agora protege automaticamente:

1. ✅ Todos os scripts de deploy (`.ps1`, `.bat`)
2. ✅ Arquivos de configuração com tokens
3. ✅ Documentação que pode conter tokens
4. ✅ Arquivos com padrões de nomes suspeitos
5. ✅ Arquivos de credenciais e secrets

---

## 🔄 Manutenção Contínua

O `.gitignore` será atualizado automaticamente sempre que:
- Novos padrões de arquivos com tokens forem detectados
- Novos tipos de credenciais forem identificados
- Novos scripts de deploy forem criados

---

**Status:** ✅ `.gitignore` atualizado e protegendo arquivos com tokens








