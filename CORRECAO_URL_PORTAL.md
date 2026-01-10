# 🔧 Correção: URL do Portal nos Apps Web

## 🐛 Problema Identificado

Quando os apps web estão em domínios diferentes do portal principal, usar URL relativa `/portal/assinaturas` não funciona.

**Exemplo:**
- Portal principal: `meusite.com`
- App web: `app-xyz.vercel.app`
- URL relativa `/portal/assinaturas` → tenta acessar `app-xyz.vercel.app/portal/assinaturas` ❌

## ✅ Solução

Usar URL absoluta do portal ou variável de ambiente.

### Opção 1: URL Absoluta (Recomendado para produção)

```jsx
<a
  href="https://www.lwdigitalforge.com/portal/produtos"
  className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
>
  Ver Produtos
</a>
```

### Opção 2: Variável de Ambiente (Recomendado)

**No `.env` do app web:**
```env
VITE_PORTAL_URL=https://www.lwdigitalforge.com
```

**No código:**
```jsx
const PORTAL_URL = import.meta.env.VITE_PORTAL_URL || 'https://www.lwdigitalforge.com';

<a
  href={`${PORTAL_URL}/portal/produtos`}
  className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
>
  Ver Produtos
</a>
```

### Opção 3: Detectar Automaticamente (Se mesmo domínio)

Se o portal e os apps estão no mesmo domínio, URL relativa funciona:

```jsx
<a
  href="/portal/assinaturas"
  className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
>
  Ver Assinaturas
</a>
```

## 📝 URL do Portal

**URL do Portal Principal:** `https://www.lwdigitalforge.com`

**Página de Redirecionamento:** `/portal/produtos` (onde o usuário pode ver e adquirir produtos)

## 🎯 Recomendação

**Use variável de ambiente** para facilitar:
- Desenvolvimento: `http://localhost:3000`
- Produção: `https://www.lwdigitalforge.com`

