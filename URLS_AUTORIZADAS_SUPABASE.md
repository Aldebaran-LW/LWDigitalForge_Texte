# 🔍 URLs Autorizadas no Supabase

## ⚠️ Possível Problema Identificado

O usuário pode precisar configurar URLs autorizadas no Supabase!

---

## 🔍 Onde Configurar no Supabase

### 1. Authentication → URL Configuration

**No Dashboard do Supabase:**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication** (lateral esquerda)
4. Vá em **URL Configuration**

**URLs a Configurar:**

#### Site URL:
```
https://jornadapro.lwdigitalforge.com
```

#### Redirect URLs (adicione):
```
https://jornadapro.lwdigitalforge.com/**
https://jornadapro.lwdigitalforge.com/auth/callback
https://lwdigitalforge.com/**
https://lwdigitalforge.com/portal/**
```

---

### 2. API → Settings → CORS

**No Dashboard do Supabase:**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** (ícone de engrenagem)
4. Vá em **API**
5. Verifique **CORS** ou **Allowed Origins**

**Origins a Configurar:**

```
https://jornadapro.lwdigitalforge.com
https://lwdigitalforge.com
http://localhost:3000
http://localhost:5173
```

---

### 3. Edge Functions → Settings (se aplicável)

**Se estiver usando Edge Functions:**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Edge Functions**
4. Verifique **CORS** ou configurações de origem

---

## 🎯 URLs Importantes

### Portal Principal:
- `https://lwdigitalforge.com`
- `https://lwdigitalforge.com/portal/**`

### Aplicação JornadaPro:
- `https://jornadapro.lwdigitalforge.com`
- `https://jornadapro.lwdigitalforge.com/**`
- `https://jornadapro.lwdigitalforge.com/auth/callback`

### Local (desenvolvimento):
- `http://localhost:3000`
- `http://localhost:5173`

---

## ✅ Checklist

- [ ] Verificar Authentication → URL Configuration
- [ ] Verificar Settings → API → CORS
- [ ] Adicionar URLs do portal
- [ ] Adicionar URLs da aplicação
- [ ] Adicionar URLs de callback
- [ ] Salvar alterações

---

## 🔍 Como Verificar

**Se URLs não estiverem configuradas, você pode ver erros como:**
- `CORS error`
- `Redirect URL not allowed`
- `Origin not allowed`
- `Invalid redirect URL`

**No console do navegador, procure por:**
- Erros de CORS
- Erros de redirect URL
- Erros de origin

---

**VERIFICAR E CONFIGURAR URLs AUTORIZADAS NO SUPABASE!** 🔍
