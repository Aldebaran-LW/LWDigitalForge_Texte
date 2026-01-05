# 🔧 Variáveis de Ambiente para Apps Web

## 📋 Diferença entre Vite e Next.js

### **Vite** (React com Vite)
Usa prefixo `VITE_`:

```env
VITE_PRODUCT_ID=e8ff7872-dedb-405c-bf8a-f7901ac4b432
VITE_PORTAL_URL=https://www.lwdigitalforge.com
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

**No código:**
```javascript
const PRODUCT_ID = import.meta.env.VITE_PRODUCT_ID;
const PORTAL_URL = import.meta.env.VITE_PORTAL_URL;
```

---

### **Next.js** (React com Next.js)
Usa prefixo `NEXT_PUBLIC_`:

```env
NEXT_PUBLIC_PRODUCT_ID=e8ff7872-dedb-405c-bf8a-f7901ac4b432
NEXT_PUBLIC_PORTAL_URL=https://www.lwdigitalforge.com
NEXT_PUBLIC_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

**No código:**
```javascript
const PRODUCT_ID = process.env.NEXT_PUBLIC_PRODUCT_ID;
const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL;
```

---

## 📝 Exemplo Completo

### Para Vite (React)

**`.env`:**
```env
VITE_PRODUCT_ID=e8ff7872-dedb-405c-bf8a-f7901ac4b432
VITE_PORTAL_URL=https://www.lwdigitalforge.com
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**No código:**
```javascript
const PRODUCT_ID = import.meta.env.VITE_PRODUCT_ID || 'uuid-do-produto-aqui';
const PORTAL_URL = import.meta.env.VITE_PORTAL_URL || 'https://www.lwdigitalforge.com';
```

---

### Para Next.js

**`.env.local`:**
```env
NEXT_PUBLIC_PRODUCT_ID=e8ff7872-dedb-405c-bf8a-f7901ac4b432
NEXT_PUBLIC_PORTAL_URL=https://www.lwdigitalforge.com
NEXT_PUBLIC_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**No código:**
```javascript
const PRODUCT_ID = process.env.NEXT_PUBLIC_PRODUCT_ID || 'uuid-do-produto-aqui';
const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://www.lwdigitalforge.com';
```

---

## 🎯 Variáveis Necessárias

### Obrigatórias:
- ✅ `PRODUCT_ID` - ID do produto/app
- ✅ `PORTAL_URL` - URL do portal principal (para redirecionamento)

### Opcionais (se usar Supabase no app):
- `SUPABASE_URL` - URL do Supabase
- `SUPABASE_ANON_KEY` - Chave anon do Supabase

---

## 📋 Checklist

- [ ] Configurar variáveis de ambiente no `.env` (Vite) ou `.env.local` (Next.js)
- [ ] Usar prefixo correto: `VITE_` para Vite, `NEXT_PUBLIC_` para Next.js
- [ ] Adicionar variáveis no Vercel/hosting (produção)
- [ ] Reiniciar servidor após adicionar variáveis

---

## ✅ Resumo

| Framework | Prefixo | Arquivo | Acesso no Código |
|-----------|---------|---------|------------------|
| **Vite** | `VITE_` | `.env` | `import.meta.env.VITE_*` |
| **Next.js** | `NEXT_PUBLIC_` | `.env.local` | `process.env.NEXT_PUBLIC_*` |

