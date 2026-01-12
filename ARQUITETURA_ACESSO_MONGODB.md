# 🔐 Arquitetura de Acesso ao MongoDB

## 📋 Pergunta

**"Se o usuário está liberado, ele tem acesso ao banco de dados MongoDB pela aplicação web jornadapro.lwdigitalforge.com?"**

---

## ✅ Resposta Curta

**SIM**, mas de forma **indireta** através da aplicação web.

---

## 🏗️ Arquitetura

### **1. Fluxo de Acesso**

```
┌─────────────────┐
│   Usuário       │
│   (Navegador)   │
└────────┬────────┘
         │
         │ 1. Acessa jornadapro.lwdigitalforge.com
         ▼
┌─────────────────────────────────────┐
│   JornadaPro (Frontend)             │
│   - Gatekeeper verifica acesso      │
│   - Chama Edge Function             │
└────────┬────────────────────────────┘
         │
         │ 2. Verifica acesso no Supabase
         ▼
┌─────────────────────────────────────┐
│   Edge Function (check-subscription)│
│   - Verifica user_purchases         │
│   - Verifica user_trials            │
│   - Retorna hasAccess: true/false   │
└────────┬────────────────────────────┘
         │
         │ 3. Se hasAccess = true
         ▼
┌─────────────────────────────────────┐
│   JornadaPro (Backend/API)          │
│   - Usa MONGODB_URI                 │
│   - Acessa MongoDB em nome do user  │
└────────┬────────────────────────────┘
         │
         │ 4. Operações no MongoDB
         ▼
┌─────────────────────────────────────┐
│   MongoDB (Atlas)                   │
│   - Dados do usuário                │
│   - Acesso controlado pela aplicação│
└─────────────────────────────────────┘
```

---

## 🔍 Detalhamento

### **1. Usuário NÃO acessa MongoDB diretamente**

- ❌ O usuário **NÃO** tem acesso direto ao MongoDB
- ✅ O acesso é **controlado pela aplicação JornadaPro**

### **2. MONGODB_URI é usado pela APLICAÇÃO**

```env
MONGODB_URI="mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority"
```

- Esta URI é usada pelo **backend/server** da aplicação JornadaPro
- **NÃO** é usada diretamente pelo navegador do usuário
- A aplicação usa esta URI para se conectar ao MongoDB

### **3. Controle de Acesso (Gatekeeper)**

Quando o usuário acessa `jornadapro.lwdigitalforge.com`:

1. **Gatekeeper verifica acesso:**
   - Chama a Edge Function `check-subscription`
   - Verifica se o usuário tem compra/trial ativo
   - Retorna `hasAccess: true` ou `false`

2. **Se `hasAccess = true`:**
   - ✅ Usuário pode usar a aplicação
   - ✅ Aplicação acessa MongoDB usando MONGODB_URI
   - ✅ Usuário pode ver/editar seus dados

3. **Se `hasAccess = false`:**
   - ❌ Usuário é bloqueado (página de "Assinatura Necessária")
   - ❌ Aplicação não acessa MongoDB para esse usuário

---

## 🔐 Segurança

### **Camadas de Segurança:**

1. **Autenticação (Supabase Auth)**
   - Usuário precisa estar logado
   - Sessão válida

2. **Autorização (Edge Function)**
   - Verifica se tem acesso (compra/trial)
   - Retorna `hasAccess: true/false`

3. **Acesso ao MongoDB (Backend)**
   - Aplicação acessa MongoDB usando MONGODB_URI
   - Usuário não acessa diretamente
   - Aplicação controla o que o usuário pode ver/editar

---

## 📊 Resumo

| Item | Descrição |
|------|-----------|
| **Acesso Direto ao MongoDB** | ❌ Não - Usuário não acessa diretamente |
| **Acesso através da Aplicação** | ✅ Sim - Se `hasAccess = true` |
| **MONGODB_URI** | Usada pelo backend/server da aplicação |
| **Controle de Acesso** | Via Edge Function (check-subscription) |
| **Gatekeeper** | Bloqueia usuários sem acesso |

---

## ✅ Resposta Final

**SIM, se o usuário está liberado (`is_liberado = true` ou tem compra/trial ativo):**

1. ✅ Ele pode acessar `jornadapro.lwdigitalforge.com`
2. ✅ O Gatekeeper verifica acesso e permite
3. ✅ A aplicação acessa MongoDB usando MONGODB_URI
4. ✅ O usuário pode usar a aplicação e ver seus dados

**Mas:**
- ❌ O usuário **NÃO** acessa MongoDB diretamente
- ✅ O acesso é **controlado pela aplicação** através do Gatekeeper

---

## 🎯 Fluxo Completo

1. **Usuário liberado** (`is_liberado = true` ou compra/trial ativo)
2. **Acessa jornadapro.lwdigitalforge.com**
3. **Gatekeeper verifica** via Edge Function
4. **Edge Function retorna** `hasAccess: true`
5. **Gatekeeper permite** acesso à aplicação
6. **Aplicação acessa MongoDB** usando MONGODB_URI
7. **Usuário usa a aplicação** e vê seus dados

---

## 💡 Importante

- O **MONGODB_URI** é uma credencial de **servidor/backend**
- Usuários **NÃO** veem ou usam essa URI diretamente
- O acesso é **indireto** através da aplicação web
- O **Gatekeeper** controla quem pode usar a aplicação
