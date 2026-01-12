# 🚀 Teste de Login Imediato

## ⚡ Passo a Passo Rápido

### 1️⃣ Primeiro: Liberar seu usuário

Vá no **Supabase > SQL Editor** e execute:

```sql
-- MUDE O EMAIL para o seu email!
UPDATE profiles
SET 
    role = 'ADMIN',  -- ← Para acessar /admin, ou deixe 'USER' para /portal
    is_liberado = true,
    data_vencimento = '2099-01-01 00:00:00'::timestamp
WHERE email = 'SEU_EMAIL_AQUI@gmail.com';
```

---

### 2️⃣ Verificar se funcionou

```sql
SELECT email, role, is_liberado, data_vencimento 
FROM profiles 
WHERE email = 'SEU_EMAIL_AQUI@gmail.com';
```

**Resultado esperado:**
- `role`: `ADMIN` (para /admin) ou `USER` (para /portal)
- `is_liberado`: `true`
- `data_vencimento`: `2099-01-01 00:00:00`

---

### 3️⃣ Testar o login

1. Abra a aplicação: `http://localhost:5173/login` (ou sua URL)
2. Faça login com seu email e senha
3. Você deve ser redirecionado para:
   - `/admin/dashboard` (se for ADMIN)
   - `/portal/dashboard` (se for USER)

---

## 🔍 Se ainda não funcionar

### Teste A: Verificar sessão no navegador

Abra **DevTools (F12) > Console** e execute:

```javascript
// Verificar se há sessão ativa
const { data: session } = await supabase.auth.getSession();
console.log('Sessão:', session);

// Se não houver sessão, fazer logout e tentar novamente
await supabase.auth.signOut();
console.log('Logout feito. Tente fazer login novamente.');
```

---

### Teste B: Limpar cache e cookies

1. **Chrome/Edge:** Ctrl + Shift + Delete
2. Selecione "Cookies" e "Cache"
3. Clique em "Limpar dados"
4. Recarregue a página (Ctrl + F5)
5. Tente fazer login novamente

---

### Teste C: Verificar RLS (Row Level Security)

Se o problema persistir, pode ser RLS bloqueando. Execute no Supabase:

```sql
-- Ver políticas RLS da tabela profiles
SELECT 
    policyname,
    cmd,
    qual as condicao
FROM pg_policies
WHERE tablename = 'profiles';
```

**Se houver políticas muito restritivas:**

```sql
-- TEMPORARIAMENTE desabilitar RLS (APENAS PARA TESTE!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Tente fazer login agora

-- IMPORTANTE: Depois de testar, REABILITAR RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

## 🎯 Qual é o seu email?

Me diga qual email você está usando para eu criar o SQL exato para você executar!

**Opções:**
1. `lucas005wfj@gmail.com`
2. `lucaswillian.yamasa@gmail.com`
3. `lucas.psf.rinopolis@gmail.com`
4. `lucas05willian@hotmail.com`
5. `lucas08willian@gmail.com`
6. Outro?

---

## 🚨 Solução de Emergência

Se NADA funcionar, execute isso para tornar o PRIMEIRO usuário cadastrado em ADMIN:

```sql
-- RESET COMPLETO: Tornar primeiro usuário em ADMIN
UPDATE profiles
SET 
    role = 'ADMIN',
    is_liberado = true,
    data_vencimento = '2099-01-01 00:00:00'::timestamp
WHERE id = (
    SELECT id FROM profiles 
    ORDER BY created_at ASC 
    LIMIT 1
);

-- Ver qual usuário se tornou ADMIN
SELECT email, role, is_liberado FROM profiles WHERE role = 'ADMIN';
```

Depois faça login com o email que aparecer no resultado.
