# 📦 Integração com Portal - Arquivos para Aplicações

Este diretório contém todos os arquivos necessários para integrar aplicações com o portal principal.

---

## 📁 Arquivos Disponíveis

### 🚀 Início Rápido
- **`INICIO-RAPIDO.md`** - Guia rápido (5 minutos)

### 📄 Arquivos Principais

1. **`hook-usePortalAuth.js`**
   - Template genérico (precisa configurar)
   - Para aplicações futuras

2. **`STOCKFORGE-usePortalAuth.js`** ⭐
   - **PRONTO PARA USAR** - StockForge
   - Product ID já configurado
   - Rota padrão já configurada

3. **`PONTO_DIARIO-usePortalAuth.js`** ⭐
   - **PRONTO PARA USAR** - Ponto Diário (JornadaPro)
   - Product ID já configurado
   - Rota padrão já configurada

### 📚 Documentação

4. **`README-INTEGRACAO-PORTAL.md`**
   - Guia completo de implementação
   - Instruções detalhadas
   - Troubleshooting

5. **`IMPLEMENTACAO-PASSO-A-PASSO.md`**
   - Passo a passo detalhado
   - Exemplos de código
   - Comandos git

6. **`CHECKLIST-IMPLEMENTACAO.md`**
   - Checklist completo
   - Testes obrigatórios
   - Validação final

### ⚙️ Configurações Específicas

7. **`STOCKFORGE-configuracao.md`**
   - Configuração específica StockForge
   - Product ID: `0cb79942-0696-4c43-bae4-d2acc46804cd`
   - Rota Padrão: `/`

8. **`PONTO_DIARIO-configuracao.md`**
   - Configuração específica Ponto Diário
   - Product ID: `e8ff7872-dedb-405c-bf8a-f7901ac4b432`
   - Rota Padrão: `/apontamentos`

### 📖 Documentação Futura

9. **`INSTRUCOES-APLICACOES-FUTURAS.md`**
   - Guia para aplicações futuras
   - Template de configuração
   - Lições aprendidas

10. **`RESUMO-IMPLEMENTACAO.md`**
    - Resumo geral
    - Status das aplicações
    - Links úteis

---

## 🚀 Como Usar

### Para StockForge (Mais Rápido)

1. Ler `INICIO-RAPIDO.md` (seção StockForge)
2. Copiar `STOCKFORGE-usePortalAuth.js` → `src/hooks/usePortalAuth.js`
3. Adicionar 3 linhas no App.jsx
4. Testar

### Para Ponto Diário (Mais Rápido)

1. Ler `INICIO-RAPIDO.md` (seção Ponto Diário)
2. Copiar `PONTO_DIARIO-usePortalAuth.js` → `src/hooks/usePortalAuth.js`
3. Adicionar 3 linhas no App.jsx
4. Testar

### Para Aplicações Futuras

1. Ler `INSTRUCOES-APLICACOES-FUTURAS.md`
2. Usar `hook-usePortalAuth.js` como template
3. Configurar Product ID e rota padrão
4. Seguir `IMPLEMENTACAO-PASSO-A-PASSO.md`

---

## 📊 Status das Aplicações

| Aplicação | Arquivo Pronto | Product ID | Rota Padrão | Status |
|-----------|----------------|------------|-------------|--------|
| **StockForge** | ✅ `STOCKFORGE-usePortalAuth.js` | `0cb79942-...` | `/` | ⏳ Pendente |
| **Ponto Diário** | ✅ `PONTO_DIARIO-usePortalAuth.js` | `e8ff7872-...` | `/apontamentos` | ⏳ Pendente |

---

## 🔗 Links dos Repositórios

- **LW StockForge:** https://github.com/Aldebaran-LW/LW_StockForge
- **Ponto Diário:** https://github.com/Aldebaran-LW/Ponto_Diario-1

---

## ⚠️ Importante

- ✅ **Não modificar** código de login existente
- ✅ **Apenas adicionar** o hook opcional
- ✅ **Testar** login normal primeiro
- ✅ **Se falhar**, remover hook e login normal funciona

---

## 📝 Estrutura de Arquivos

```
APLICACOES/
├── INICIO-RAPIDO.md                    ⭐ Comece aqui
├── STOCKFORGE-usePortalAuth.js         ⭐ Pronto para StockForge
├── PONTO_DIARIO-usePortalAuth.js       ⭐ Pronto para Ponto Diário
├── hook-usePortalAuth.js               Template genérico
├── README-INTEGRACAO-PORTAL.md         Guia completo
├── IMPLEMENTACAO-PASSO-A-PASSO.md      Passo a passo
├── CHECKLIST-IMPLEMENTACAO.md          Checklist
├── STOCKFORGE-configuracao.md          Config StockForge
├── PONTO_DIARIO-configuracao.md        Config Ponto Diário
├── INSTRUCOES-APLICACOES-FUTURAS.md    Para futuras apps
└── RESUMO-IMPLEMENTACAO.md             Resumo geral
```

---

**Última atualização:** 25 de Janeiro de 2026
