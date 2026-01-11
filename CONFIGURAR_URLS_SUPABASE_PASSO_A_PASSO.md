# 🔧 Configurar URLs Autorizadas no Supabase - Passo a Passo

## ✅ O Que Configurar

No Supabase, você precisa configurar URLs autorizadas principalmente em:

1. **Authentication → URL Configuration** (Redirect URLs)
2. **Settings → API** (CORS - se necessário)

---

## 🔍 Passo 1: Authentication → URL Configuration

### Como Acessar:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral esquerdo, clique em **Authentication**
4. Clique em **URL Configuration**

### O Que Configurar:

#### Site URL:
```
https://lwdigitalforge.com
```

#### Redirect URLs (adicione uma por linha):

**Portal Principal:**
```
https://lwdigitalforge.com/**
https://lwdigitalforge.com/portal/**
https://lwdigitalforge.com/auth/callback
```

**Aplicação JornadaPro:**
```
https://jornadapro.lwdigitalforge.com/**
https://jornadapro.lwdigitalforge.com/auth/callback
```

**Local (desenvolvimento):**
```
http://localhost:3000/**
http://localhost:5173/**
http://localhost:3000/auth/callback
```

### ⚠️ Importante:

- Use `/**` para permitir todas as rotas daquele domínio
- Use caminho específico (como `/auth/callback`) para rotas específicas
- Certifique-se de incluir `http://` ou `https://`
- Não esqueça do `/` no final se usar `/**`

---

## 🔍 Passo 2: Settings → API (CORS - se necessário)

### Como Acessar:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral esquerdo, clique em **Settings** (ícone de engrenagem)
4. Clique em **API**

### O Que Verificar:

#### Allowed Origins (se disponível):

**Produção:**
```
https://lwdigitalforge.com
https://jornadapro.lwdigitalforge.com
```

**Desenvolvimento:**
```
http://localhost:3000
http://localhost:5173
```

### ⚠️ Nota:

- O Supabase geralmente não requer configuração manual de CORS para a API REST
- A configuração de Redirect URLs no Authentication geralmente é suficiente
- Se houver erros de CORS, verifique esta configuração

---

## 🎯 URLs Importantes a Configurar

### Portal Principal (lwdigitalforge.com):
```
https://lwdigitalforge.com
https://lwdigitalforge.com/**
https://lwdigitalforge.com/portal/**
https://lwdigitalforge.com/auth/callback
```

### Aplicação JornadaPro (jornadapro.lwdigitalforge.com):
```
https://jornadapro.lwdigitalforge.com
https://jornadapro.lwdigitalforge.com/**
https://jornadapro.lwdigitalforge.com/auth/callback
```

### Local (desenvolvimento):
```
http://localhost:3000
http://localhost:3000/**
http://localhost:5173
http://localhost:5173/**
```

---

## ✅ Checklist

- [ ] Acessar Supabase Dashboard
- [ ] Ir em Authentication → URL Configuration
- [ ] Configurar Site URL
- [ ] Adicionar Redirect URLs do portal
- [ ] Adicionar Redirect URLs da aplicação
- [ ] Adicionar Redirect URLs locais (se necessário)
- [ ] Salvar alterações
- [ ] Testar novamente

---

## 🔍 Como Verificar se Está Funcionando

**Se URLs não estiverem configuradas, você pode ver erros como:**
- `Invalid redirect URL`
- `Redirect URL not allowed`
- `Origin not allowed`
- `CORS error`

**No console do navegador, procure por:**
- Erros de redirect URL
- Erros de CORS
- Erros de origin

---

## ✅ Após Configurar

1. **Salvar alterações** no Supabase
2. **Aguardar alguns segundos** para propagação
3. **Testar novamente:**
   - Tentar acessar aplicação
   - Verificar se não há erros de redirect
   - Verificar console do navegador

---

**CONFIGURAR URLs NO SUPABASE E TESTAR NOVAMENTE!** 🔧
