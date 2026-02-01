# ✅ Checklist de Implementação - Integração com Portal

Use este checklist para garantir que a implementação está completa e não quebrou nada.

---

## 📋 Pré-Implementação

- [ ] Fazer backup do código atual (commit antes de começar)
- [ ] Ler `README-INTEGRACAO-PORTAL.md` completamente
- [ ] Identificar o Product ID da aplicação
- [ ] Identificar a rota padrão da aplicação
- [ ] Identificar onde está o cliente Supabase na aplicação

---

## 🔧 Implementação

### Hook
- [ ] Criar arquivo `src/hooks/usePortalAuth.js`
- [ ] Configurar `PRODUCT_ID` no hook
- [ ] Configurar `DEFAULT_ROUTE` no hook
- [ ] Ajustar caminho do import do Supabase
- [ ] Verificar se o hook compila sem erros

### App Principal
- [ ] Adicionar import do hook
- [ ] Adicionar `usePortalAuth()` no componente
- [ ] Adicionar loading enquanto verifica
- [ ] Verificar se o código compila sem erros

---

## 🧪 Testes

### Teste 1: Login Normal (CRÍTICO)
- [ ] Limpar cookies/sessão do navegador
- [ ] Acessar aplicação diretamente (sem passar pelo portal)
- [ ] **Verificar:** Sistema de login atual funciona normalmente?
- [ ] **Verificar:** Pode fazer login normalmente?
- [ ] **Verificar:** Após login, aplicação funciona normalmente?

**Se algo não funcionar aqui, PARAR e reverter as mudanças.**

### Teste 2: Acesso via Portal
- [ ] Fazer login no portal principal
- [ ] Ir para "Meus Produtos" ou "Testes Ativos"
- [ ] Clicar em "Acessar Aplicação"
- [ ] **Verificar:** Aplicação abre em nova aba?
- [ ] **Verificar:** Autentica automaticamente (não mostra login)?
- [ ] **Verificar:** Vai para rota padrão correta?

### Teste 3: Hash Inválido (Fallback)
- [ ] Modificar hash na URL para ser inválido
- [ ] Acessar aplicação
- [ ] **Verificar:** Não quebra a aplicação?
- [ ] **Verificar:** Login normal funciona?

### Teste 4: Sem Hash (Comportamento Normal)
- [ ] Acessar aplicação sem hash
- [ ] **Verificar:** Comportamento é igual ao anterior?
- [ ] **Verificar:** Login funciona normalmente?

---

## 📝 Documentação

- [ ] Adicionar comentário no código explicando o hook
- [ ] Documentar Product ID usado
- [ ] Documentar rota padrão configurada
- [ ] Atualizar README da aplicação (opcional)

---

## ✅ Validação Final

- [ ] Todos os testes passaram?
- [ ] Login normal continua funcionando?
- [ ] Acesso via portal funciona?
- [ ] Código não tem erros de compilação?
- [ ] Não há warnings críticos no console?

---

## 🚨 Se Algo Quebrar

1. **PARAR imediatamente**
2. **Reverter mudanças** (git revert ou desfazer)
3. **Verificar o que causou o problema**
4. **Corrigir antes de continuar**

**Lembre-se:** O hook é opcional. Se causar problemas, pode ser removido sem afetar o login normal.

---

**Checklist criado em:** 25 de Janeiro de 2026
