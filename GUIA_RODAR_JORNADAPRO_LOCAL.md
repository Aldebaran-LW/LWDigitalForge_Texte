# 🚀 Guia: Rodar JornadaPro Localmente

## 📋 Pré-requisitos

1. ✅ Node.js instalado (v18 ou superior)
2. ✅ MongoDB URI configurada
3. ✅ Supabase configurado
4. ✅ Acesso liberado no Supabase

---

## 🗂️ Localização do Repositório

O repositório JornadaPro está em:
- **Path:** `C:\Users\LUCAS_W\.cursor\projects\Ponto_Diario-1-2`
- **Submodule:** `ponto_diario_temp` (no workspace atual)

---

## ⚙️ PASSO 1: Configurar Variáveis de Ambiente

### **1.1. Criar arquivo `.env.local`**

No diretório do JornadaPro (`C:\Users\LUCAS_W\.cursor\projects\Ponto_Diario-1-2`), crie um arquivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3d5dXdpZ2hkZWhtdm5vbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MDgsImV4cCI6MjA3ODcwMjcwOH0.m5r_mc9zIKsnc13rXGi6fkfRAoL2cGhgzZH3yRScnVA

# MongoDB
MONGODB_URI=mongodb+srv://Vercel-Admin-JornadaPro:ewVmHb7gAWngmiRB@jornadapro.gyc7cgi.mongodb.net/?retryWrites=true&w=majority

# URL da aplicação (local)
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Edge Function URL
NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL=https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1
```

---

## 📦 PASSO 2: Instalar Dependências

Abra o terminal no diretório do JornadaPro:

```bash
cd C:\Users\LUCAS_W\.cursor\projects\Ponto_Diario-1-2
npm install
```

---

## 🔧 PASSO 3: Verificar Scripts Disponíveis

Verifique o `package.json` para ver os scripts disponíveis. Normalmente será:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

---

## 🚀 PASSO 4: Rodar Aplicação Localmente

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação deve rodar em: **`http://localhost:3000`** (ou outra porta, dependendo da configuração)

---

## ✅ PASSO 5: Verificar se Funciona

1. Abra o navegador em `http://localhost:3000`
2. Faça login com:
   - Email: `lwdigitalforge@gmail.com`
   - Senha: `LW_Digital_Forge/123`
3. Verifique se carrega sem bloqueio
4. Teste funcionalidades:
   - Ver empresas (tenants)
   - Ver funcionários (employees)
   - Ver apontamentos (time_entries)
   - Criar novos registros

---

## 🔍 Verificar Acesso Antes de Testar

Antes de rodar localmente, **certifique-se de que seu acesso está liberado**:

Execute no Supabase SQL Editor:

```sql
-- Verificar se tem acesso
SELECT 
  up.id,
  p.email,
  ra.name as app_name,
  up.purchase_type,
  up.status,
  CASE 
    WHEN up.purchase_type = 'LIFETIME' AND up.status = 'APPROVED' THEN '✅ VITALÍCIO'
    ELSE '❌ SEM_ACESSO'
  END AS status_acesso
FROM user_purchases up
LEFT JOIN profiles p ON p.id = up.user_id
LEFT JOIN registered_apps ra ON ra.id = up.app_id
WHERE up.user_id = (SELECT id FROM profiles WHERE email = 'lwdigitalforge@gmail.com')
  AND up.app_id = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432';
```

**Deve mostrar:** `✅ VITALÍCIO`

---

## ⚠️ Problemas Comuns

### **1. Porta já em uso**

Se a porta 3000 estiver ocupada, o Next.js automaticamente usará 3001, 3002, etc.

Ou configure uma porta específica:

```bash
npm run dev -- -p 3001
```

### **2. MongoDB não conecta**

Verifique:
- ✅ `MONGODB_URI` está correta
- ✅ MongoDB está acessível
- ✅ Credenciais estão corretas

### **3. Supabase não conecta**

Verifique:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` está correto
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` está correto
- ✅ Credenciais estão corretas

### **4. Acesso bloqueado**

Se aparecer "Acesso Bloqueado" ou "Assinatura Necessária":
- ✅ Verifique se o acesso foi liberado no Supabase (SQL acima)
- ✅ Verifique se o Edge Function `check-subscription` está funcionando
- ✅ Verifique logs do console do navegador (F12)

---

## 📝 Checklist de Teste Local

Após rodar localmente:

- [ ] ✅ Aplicação inicia sem erros
- [ ] ✅ Login funciona
- [ ] ✅ Aplicação carrega sem bloqueio
- [ ] ✅ Ver empresas funciona
- [ ] ✅ Ver funcionários funciona
- [ ] ✅ Ver apontamentos funciona
- [ ] ✅ Criar novos registros funciona
- [ ] ✅ MongoDB conecta corretamente
- [ ] ✅ Supabase conecta corretamente

---

## 🎯 Próximos Passos

1. ✅ **Rodar localmente** (este guia)
2. ⏭️ **Testar funcionalidades**
3. ⏭️ **Preencher checklist**
4. ⏭️ **Confirmar migração MongoDB**
5. ⏭️ **Remover tabelas antigas do Supabase**

---

## 💡 Dica

Se estiver usando o submodule `ponto_diario_temp` no workspace atual, você pode rodar de lá também, mas é recomendado usar o repositório principal em `C:\Users\LUCAS_W\.cursor\projects\Ponto_Diario-1-2`.
