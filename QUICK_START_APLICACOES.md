# ⚡ Quick Start: Criar Nova Aplicação

## 🚀 Passos Rápidos

### 1. Configurar Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
VITE_PRODUCT_ID=uuid-do-produto-aqui  # ⚠️ OBRIGATÓRIO!
VITE_PORTAL_URL=https://www.lwdigitalforge.com
```

### 2. Instalar Supabase

```bash
npm install @supabase/supabase-js
```

### 3. Criar Cliente Supabase

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### 4. Verificar Acesso (Código Mínimo)

```javascript
// src/App.jsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      // 1. Verificar autenticação
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // 2. Obter appId
      const appId = sessionStorage.getItem('app_product_id') || 
                    import.meta.env.VITE_PRODUCT_ID;

      if (!appId) {
        setLoading(false);
        return;
      }

      // 3. Verificar acesso via Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-subscription`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            email: session.user.email,
            appId: appId, // ⚠️ OBRIGATÓRIO!
          }),
        }
      );

      const result = await response.json();
      setHasAccess(result.hasAccess || false);
      setLoading(false);
    };

    verifyAccess();
  }, []);

  if (loading) {
    return <div>Verificando acesso...</div>;
  }

  if (!hasAccess) {
    return (
      <div>
        <h1>Assinatura Necessária</h1>
        <a href={`${import.meta.env.VITE_PORTAL_URL}/portal/produtos`}>
          Assinar Agora
        </a>
      </div>
    );
  }

  return <div>Sua aplicação aqui</div>;
}
```

## ⚠️ Pontos Críticos

1. **appId é OBRIGATÓRIO** - Sem ele, a verificação falha
2. **Ler do sessionStorage** - O portal salva `app_product_id` lá
3. **Fallback para env** - Use `VITE_PRODUCT_ID` se não encontrar no sessionStorage
4. **Verificar autenticação primeiro** - Sem usuário logado, não há acesso

## 📚 Documentação Completa

Veja `GUIA_COMPLETO_APLICACOES.md` para:
- ✅ Implementação completa
- ✅ Contexto de autenticação
- ✅ Hooks reutilizáveis
- ✅ Tela de acesso negado
- ✅ Troubleshooting
- ✅ Checklist completo

## 🔍 Diagnóstico

Se algo não funcionar:

1. Execute: `DIAGNOSTICO_ACESSO_USUARIO.sql`
2. Verifique console do navegador
3. Verifique logs da Edge Function
4. Confirme que `appId` está correto
