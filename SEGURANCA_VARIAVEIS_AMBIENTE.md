# 🔒 Segurança das Variáveis de Ambiente VITE_

## ⚠️ IMPORTANTE: Variáveis com Prefixo VITE_ são Expostas ao Navegador

### Como Funciona

**Qualquer variável que começa com `VITE_` é:**
- ✅ Injetada no código JavaScript do navegador durante o build
- ✅ Visível no código-fonte do site (qualquer pessoa pode ver)
- ✅ Acessível via `import.meta.env.VITE_*` no console do navegador

**Isso é por design do Vite** - é assim que funciona o sistema de variáveis de ambiente para frontend.

---

## 📋 Análise das Chaves Atuais

### ✅ Chaves Públicas (Seguras para Expor)

#### 1. `VITE_SUPABASE_ANON_KEY`
```
sb_publishable_1XbN1pPLU2xlJTaD_OlL7g_8WCUNU83
```

**Status:** ✅ **SEGURA para expor publicamente**

**Por quê:**
- É uma chave **anônima/pública** do Supabase
- Projetada especificamente para uso no frontend
- Protegida por **Row Level Security (RLS)** no Supabase
- Não permite acesso a dados sensíveis sem autenticação
- Semelhante a uma API key pública

**⚠️ Importante:**
- Certifique-se de que o RLS está configurado corretamente no Supabase
- Não use a `SERVICE_ROLE_KEY` (essa é privada e nunca deve ter prefixo VITE_)

---

#### 2. `VITE_MERCADOPAGO_PUBLIC_KEY`
```
APP_USR-a2044252-584b-4715-a558-bf11c837874a
```

**Status:** ✅ **SEGURA para expor publicamente**

**Por quê:**
- É uma chave **pública** do Mercado Pago
- Projetada para uso no frontend
- Usada apenas para iniciar o checkout
- Não permite acessar dados sensíveis ou processar pagamentos

**⚠️ Importante:**
- O `MERCADOPAGO_ACCESS_TOKEN` (privado) NÃO tem prefixo VITE_, então está seguro

---

#### 3. `VITE_FIREBASE_API_KEY`
```
AIzaSyDDkqKtL4VtaykNWCho9Ozj3mTRKQNEUPQ
```

**Status:** ⚠️ **Parcialmente segura** (depende de configuração)

**Por quê:**
- É uma chave pública do Firebase
- Projetada para uso no frontend
- **MAS** deve ter restrições de domínio configuradas no Firebase Console

**⚠️ Ação Necessária:**
1. Acesse: https://console.firebase.google.com/
2. Vá em: Project Settings → General
3. Na seção "Your apps", encontre sua API Key
4. Configure restrições de HTTP referrer para permitir apenas seu domínio

---

### 🔒 Chaves Privadas (NÃO Expostas - Corretas)

Estas chaves **NÃO** têm prefixo `VITE_`, então **NÃO** são expostas ao navegador:

- ✅ `MERCADOPAGO_ACCESS_TOKEN` - Usada apenas em Edge Functions (servidor)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Usada apenas em Edge Functions (servidor)
- ✅ `SUPABASE_ACCESS_TOKEN` - Usada apenas para CLI/MCP (servidor)
- ✅ `VERCEL_TOKEN` - Usada apenas para CLI (servidor)
- ✅ `FIREBASE_PRIVATE_KEY` - Usada apenas em Edge Functions (servidor)

**Status:** ✅ **Todas estão corretas e seguras!**

---

## 🛡️ Boas Práticas de Segurança

### ✅ O que está correto no seu projeto:

1. **Chaves públicas têm prefixo VITE_** ✅
   - `VITE_SUPABASE_ANON_KEY` - Pública
   - `VITE_MERCADOPAGO_PUBLIC_KEY` - Pública
   - `VITE_FIREBASE_API_KEY` - Pública

2. **Chaves privadas NÃO têm prefixo VITE_** ✅
   - `MERCADOPAGO_ACCESS_TOKEN` - Privada
   - `SUPABASE_SERVICE_ROLE_KEY` - Privada
   - `SUPABASE_ACCESS_TOKEN` - Privada

3. **Arquivo .env está no .gitignore** ✅
   - Não será commitado no Git

---

## ⚠️ Ações Recomendadas

### 1. Configurar Restrições no Firebase

**Para `VITE_FIREBASE_API_KEY`:**
1. Acesse: https://console.firebase.google.com/
2. Vá em: Project Settings → General
3. Role até "Your apps" → Web app
4. Clique em "Add domain" e adicione apenas seu domínio de produção
5. Isso limita o uso da API key apenas ao seu site

### 2. Verificar RLS no Supabase

**Para `VITE_SUPABASE_ANON_KEY`:**
1. Acesse: Supabase Dashboard → Authentication → Policies
2. Verifique se todas as tabelas têm RLS habilitado
3. Verifique se as políticas estão corretas
4. Teste se usuários não autenticados não podem acessar dados sensíveis

### 3. Verificar Restrições no Mercado Pago

**Para `VITE_MERCADOPAGO_PUBLIC_KEY`:**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Verifique as configurações de segurança
3. Configure webhooks apenas para seu domínio

---

## 🔍 Como Verificar o que Está Exposto

### No Console do Navegador (F12):

```javascript
// Ver todas as variáveis VITE_ expostas
console.log('Todas as variáveis VITE_:', import.meta.env);

// Verificar chaves específicas
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Mercado Pago Key:', import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);
console.log('Firebase Key:', import.meta.env.VITE_FIREBASE_API_KEY);
```

**Resultado esperado:**
- ✅ Chaves públicas aparecerão (isso é normal e seguro)
- ✅ Chaves privadas NÃO aparecerão (isso é correto)

---

## 📊 Resumo de Segurança

| Variável | Tipo | Exposta? | Segura? | Ação Necessária |
|----------|------|----------|---------|-----------------|
| `VITE_SUPABASE_ANON_KEY` | Pública | ✅ Sim | ✅ Sim | Verificar RLS |
| `VITE_MERCADOPAGO_PUBLIC_KEY` | Pública | ✅ Sim | ✅ Sim | Nenhuma |
| `VITE_FIREBASE_API_KEY` | Pública | ✅ Sim | ⚠️ Parcial | Configurar restrições |
| `MERCADOPAGO_ACCESS_TOKEN` | Privada | ❌ Não | ✅ Sim | Nenhuma |
| `SUPABASE_SERVICE_ROLE_KEY` | Privada | ❌ Não | ✅ Sim | Nenhuma |
| `SUPABASE_ACCESS_TOKEN` | Privada | ❌ Não | ✅ Sim | Nenhuma |
| `VERCEL_TOKEN` | Privada | ❌ Não | ✅ Sim | Nenhuma |

---

## ✅ Conclusão

**Status Geral:** ✅ **SEGURO**

- Todas as chaves públicas estão corretamente marcadas com `VITE_`
- Todas as chaves privadas estão corretamente sem `VITE_`
- O arquivo `.env` está protegido no `.gitignore`

**Recomendações:**
1. Configure restrições de domínio no Firebase
2. Verifique as políticas RLS no Supabase
3. Continue usando as chaves públicas no frontend (é o comportamento esperado)

---

## 🆘 Se Alguém Ver Suas Chaves Públicas

**Não se preocupe!** As chaves públicas são **projetadas** para serem visíveis:
- Elas são limitadas por políticas de segurança (RLS, restrições de domínio)
- Não permitem acesso a dados sensíveis sem autenticação
- É assim que aplicações web modernas funcionam

**O que NUNCA deve ser exposto:**
- ❌ Service Role Keys
- ❌ Access Tokens privados
- ❌ Private Keys
- ❌ Senhas ou secrets

**Todas essas estão protegidas no seu projeto!** ✅
