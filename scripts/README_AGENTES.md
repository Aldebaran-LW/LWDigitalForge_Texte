# 🤖 Scripts Agentes para Liberação

Scripts para automatizar a liberação de usuários no sistema.

## 📦 Scripts Disponíveis

1. **`agente-criar-trial.js`** - Criar trial para um usuário
2. **`agente-criar-compra.js`** - Criar compra/assinatura para um usuário
3. **`agente-liberacao-lote.js`** - Liberar múltiplos usuários em lote

## 🚀 Uso Rápido

### Criar Trial
```bash
node scripts/agente-criar-trial.js usuario@email.com "NomeDoApp" 14
```

### Criar Compra
```bash
node scripts/agente-criar-compra.js usuario@email.com "NomeDoApp" LIFETIME
```

### Liberação em Lote
```bash
node scripts/agente-liberacao-lote.js scripts/exemplos/usuarios-exemplo.csv trial
```

## 📖 Documentação Completa

Consulte o arquivo `GUIA_AGENTES_LIBERACAO.md` na raiz do projeto para documentação completa.

## 📝 Exemplos

Arquivos de exemplo estão disponíveis em `scripts/exemplos/`:
- `usuarios-exemplo.csv` - Exemplo de arquivo CSV
- `liberacoes-exemplo.json` - Exemplo de arquivo JSON
