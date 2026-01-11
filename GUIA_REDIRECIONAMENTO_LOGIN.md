# 🔄 Guia de Atualização: Redirecionamento no Login

## 📋 Mudanças Realizadas

### 1. **PaginaLogin.jsx** - Verificação de Acesso após Login

**Mudança:** Adicionado `useEffect` que verifica acesso do usuário após login e redireciona apropriadamente.

**Comportamento:**
- Se o usuário tem acesso a qualquer app → `/portal/dashboard`
- Se o usuário não tem acesso → `/portal/produtos`
- Fallback em caso de erro → `/portal/dashboard`

**Nota:** A função RPC `get_user_apps_status` deve estar disponível no Supabase. Se não estiver, o fallback redireciona para o dashboard.

---

### 2. **HomePage.jsx** - Auto-Redirect se já estiver logado

**Mudança:** Adicionado `useEffect` que detecta se o usuário já está logado e redireciona automaticamente.

**Comportamento:**
- Se `user` existe e `loading` é `false` → redireciona para `/portal/dashboard`
- Se ainda estiver carregando → mostra página normalmente (evita flash)

---

### 3. **Gatekeeper (JornadaPro)** - Documentação Criada

**Mudança:** Criado documento com exemplos de como atualizar o Gatekeeper no JornadaPro.

**Arquivo:** `ponto_diario_temp/GATEKEEPER_REDIRECT_ATUALIZACAO.md`

**Conteúdo:** Exemplos de código para adicionar botões de redirecionamento quando o acesso for negado.

---

## ⚠️ Requisitos

### **Função RPC Necessária**

Para que o redirecionamento funcione corretamente, a função RPC `get_user_apps_status` deve estar criada no Supabase:

1. Execute o SQL: `SQL_FUNCAO_GET_USER_APPS_STATUS.sql`
2. Ou execute a migration: `supabase/migrations/20250112000000_create_get_user_apps_status_function.sql`

**Se a função não existir:**
- O redirecionamento ainda funciona (usa fallback)
- Mas pode não redirecionar corretamente (sempre vai para dashboard)

---

## 🧪 Testes

### Teste 1: Login com usuário que tem acesso

1. Faça login
2. **Esperado:** Redireciona para `/portal/dashboard`

### Teste 2: Login com usuário novo (sem acesso)

1. Crie uma conta nova
2. Faça login
3. **Esperado:** Redireciona para `/portal/produtos`

### Teste 3: HomePage com usuário logado

1. Faça login
2. Acesse a página inicial (`/`)
3. **Esperado:** Redireciona automaticamente para `/portal/dashboard`

### Teste 4: HomePage com usuário não logado

1. Faça logout
2. Acesse a página inicial (`/`)
3. **Esperado:** Mostra a landing page normalmente

---

## 🔍 Verificação

### Verificar se a função RPC existe:

```sql
SELECT proname FROM pg_proc WHERE proname = 'get_user_apps_status';
```

### Verificar comportamento no console:

Abra o console do navegador e verifique:
- Mensagens de erro (se a função RPC não existir)
- Redirecionamentos realizados

---

## 🐛 Troubleshooting

### Problema: Sempre redireciona para dashboard

**Causa:** Função RPC não existe ou está retornando erro

**Solução:**
1. Verifique se a função foi criada
2. Verifique o console para erros
3. O fallback sempre redireciona para dashboard em caso de erro

### Problema: Redirecionamento não acontece

**Causa:** `user` não está sendo atualizado corretamente

**Solução:**
1. Verifique se `user` está sendo definido no contexto
2. Verifique logs no console
3. Verifique se o `useEffect` está sendo executado

### Problema: Flash de conteúdo antes do redirect

**Solução:** 
- Já implementado: `if (loading) return null;` na HomePage
- Se ainda houver flash, pode adicionar um spinner

---

## 📝 Notas Importantes

1. **Dependência da função RPC:** O redirecionamento inteligente depende da função RPC. Se não estiver disponível, usa fallback seguro.

2. **Ordem de execução:** O `useEffect` no PaginaLogin observa `user`, então o redirecionamento acontece após o login bem-sucedido.

3. **HomePage redirect:** O redirect na HomePage acontece apenas se o usuário já estiver logado (evita redirect desnecessário).

4. **Gatekeeper:** O arquivo no JornadaPro precisa ser atualizado manualmente (exemplos fornecidos no documento).

---

## ✅ Checklist de Implementação

- [x] PaginaLogin.jsx atualizado
- [x] HomePage.jsx atualizado
- [ ] Função RPC `get_user_apps_status` executada no Supabase
- [ ] Gatekeeper atualizado no JornadaPro (manual)
- [ ] Testado login com usuário que tem acesso
- [ ] Testado login com usuário novo
- [ ] Testado HomePage com usuário logado
- [ ] Testado HomePage com usuário não logado
