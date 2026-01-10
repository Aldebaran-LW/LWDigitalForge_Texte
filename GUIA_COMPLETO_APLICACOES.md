# 📘 Guia Completo: Como Criar uma Nova Aplicação no Sistema LWDigitalForge

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Implementação de Autenticação](#implementação-de-autenticação)
4. [Verificação de Assinatura e Acesso](#verificação-de-assinatura-e-acesso)
5. [Integração com o Portal](#integração-com-o-portal)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Exemplo Completo](#exemplo-completo)
8. [Checklist de Implementação](#checklist-de-implementação)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Pré-requisitos

Antes de começar, você precisa:

- ✅ Conta no Supabase configurada
- ✅ Aplicação registrada no portal (tabela `registered_apps`)
- ✅ ID do produto/app (UUID)
- ✅ URL de deploy da aplicação (Vercel, etc.)
- ✅ Cliente Supabase configurado na aplicação

---

## ⚙️ Configuração Inicial

### 1. Instalar Dependências

```bash
npm install @supabase/supabase-js
# ou
yarn add @supabase/supabase-js
```

### 2. Configurar Cliente Supabase

Crie o arquivo `src/lib/supabase.js` (ou similar):

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui

# Edge Function (para verificação de assinatura)
VITE_SUPABASE_FUNCTIONS_URL=https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1

# ID do Produto/App (OBRIGATÓRIO!)
VITE_PRODUCT_ID=uuid-do-produto-aqui

# URL do Portal Principal
VITE_PORTAL_URL=https://www.lwdigitalforge.com
```

**⚠️ IMPORTANTE:** O `VITE_PRODUCT_ID` é **OBRIGATÓRIO** para verificação de acesso!

---

## 🔐 Implementação de Autenticação

### Opção 1: Usar Contexto de Autenticação (Recomendado)

Se sua aplicação usa React, crie um contexto de autenticação:

```javascript
// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
```

### Opção 2: Verificação Simples

Se não usar contexto, verifique a sessão diretamente:

```javascript
import { supabase } from '@/lib/supabase';

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
}
```

---

## 🔒 Verificação de Assinatura e Acesso

### ⚠️ IMPORTANTE: appId é OBRIGATÓRIO!

A Edge Function `check-subscription` **requer** o `appId` ou `productId` para funcionar corretamente.

### Método 1: Usar Edge Function (Recomendado)

Crie um hook ou função para verificar acesso:

```javascript
// src/hooks/useSubscription.js
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkSubscription = useCallback(async (appId) => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    if (!appId) {
      setError('appId é obrigatório para verificar acesso ao app específico');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-subscription`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          appId: appId, // OBRIGATÓRIO!
          productId: appId, // Enviar ambos para compatibilidade
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Erro ao verificar assinatura';
      setError(errorMessage);
      console.error('Erro ao verificar assinatura:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    checkSubscription,
    loading,
    error,
  };
}
```

### Método 2: Verificação Direta no Banco (Alternativa)

Se preferir verificar diretamente no banco:

```javascript
// src/utils/verifyAccess.js
import { supabase } from '@/lib/supabase';

/**
 * Verifica se o usuário tem acesso ao app
 * @param {string} userId - ID do usuário
 * @param {string} appId - ID do app/produto (OBRIGATÓRIO!)
 * @returns {Promise<{hasAccess: boolean, accessType: string|null}>}
 */
export async function verifyAppAccess(userId, appId) {
  if (!userId || !appId) {
    return { hasAccess: false, accessType: null };
  }

  const now = new Date().toISOString();

  // 1. Verificar assinatura ativa para este app específico
  const { data: subscriptions } = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', appId) // FILTRO ESPECÍFICO DO APP
    .eq('status', 'APPROVED')
    .in('purchase_type', ['MONTHLY', 'ANNUAL', 'LIFETIME']);

  if (subscriptions && subscriptions.length > 0) {
    // Verificar se alguma assinatura está ativa
    for (const sub of subscriptions) {
      if (sub.purchase_type === 'LIFETIME') {
        return { hasAccess: true, accessType: 'subscription_lifetime' };
      }
      if (sub.expires_at && new Date(sub.expires_at) > new Date(now)) {
        return { 
          hasAccess: true, 
          accessType: sub.purchase_type === 'MONTHLY' ? 'subscription_monthly' : 'subscription_annual' 
        };
      }
    }
  }

  // 2. Verificar compra específica
  const { data: purchase } = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .eq('status', 'APPROVED')
    .single();

  if (purchase) {
    return { hasAccess: true, accessType: 'purchase' };
  }

  // 3. Verificar trial ativo
  const { data: trial } = await supabase
    .from('user_trials')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', appId) // FILTRO ESPECÍFICO DO APP
    .eq('is_active', true)
    .gt('expires_at', now)
    .single();

  if (trial) {
    return { hasAccess: true, accessType: 'trial' };
  }

  return { hasAccess: false, accessType: null };
}
```

---

## 🔗 Integração com o Portal

### Como o Portal Envia Dados

Quando o usuário clica em "Acessar Aplicação" no portal, o seguinte acontece:

1. O portal salva o `product.id` no `sessionStorage`:
   ```javascript
   sessionStorage.setItem('app_product_id', product.id);
   ```

2. O portal abre a aplicação em nova aba:
   ```javascript
   window.open(product.vercel_deployment_url, '_blank');
   ```

### Como a Aplicação Deve Ler os Dados

Sua aplicação deve ler o `appId` do `sessionStorage`:

```javascript
// No componente principal da aplicação
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { checkSubscription, loading: subLoading } = useSubscription();
  const [hasAccess, setHasAccess] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      // 1. Aguardar autenticação
      if (authLoading || !user) {
        return;
      }

      // 2. Obter appId do sessionStorage (salvo pelo portal)
      const appId = sessionStorage.getItem('app_product_id') || 
                    import.meta.env.VITE_PRODUCT_ID;

      if (!appId) {
        console.error('App ID não encontrado!');
        setAccessDenied(true);
        return;
      }

      // 3. Verificar acesso com appId
      const result = await checkSubscription(appId);

      if (result?.hasAccess) {
        setHasAccess(true);
      } else {
        setAccessDenied(true);
      }
    };

    verifyAccess();
  }, [user, authLoading, checkSubscription]);

  // Mostrar loading
  if (authLoading || subLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Mostrar tela de acesso negado
  if (accessDenied || !hasAccess) {
    return <AccessDeniedScreen />;
  }

  // Renderizar aplicação
  return <YourAppContent />;
}
```

---

## 🎨 Tela de Acesso Negado

Crie um componente para quando o acesso for negado:

```javascript
// src/components/AccessDeniedScreen.jsx
import { Lock } from 'lucide-react';

export function AccessDeniedScreen() {
  const portalUrl = import.meta.env.VITE_PORTAL_URL || 'https://www.lwdigitalforge.com';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <Lock className="h-16 w-16 text-blue-500 mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Assinatura Necessária
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Você precisa de uma assinatura ativa para acessar esta aplicação
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          Para continuar usando, é necessário ter uma assinatura ativa ou estar em período de teste.
        </p>
        
        <div className="space-y-3">
          <a
            href={`${portalUrl}/portal/produtos`}
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Assinar Agora
          </a>
          
          <a
            href={`${portalUrl}/login`}
            className="block w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Voltar ao Login
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## 📝 Variáveis de Ambiente Completas

```env
# Supabase
VITE_SUPABASE_URL=https://wwwwyuwighdehmvnolrl.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui

# Edge Function
VITE_SUPABASE_FUNCTIONS_URL=https://wwwwyuwighdehmvnolrl.supabase.co/functions/v1

# ID do Produto/App (OBRIGATÓRIO!)
VITE_PRODUCT_ID=uuid-do-produto-aqui

# URL do Portal Principal
VITE_PORTAL_URL=https://www.lwdigitalforge.com
```

---

## 📦 Exemplo Completo

Aqui está um exemplo completo de uma aplicação funcional:

```javascript
// src/App.jsx
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { AccessDeniedScreen } from '@/components/AccessDeniedScreen';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { checkSubscription, loading: subLoading } = useSubscription();
  const [hasAccess, setHasAccess] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      if (authLoading || !user) {
        return;
      }

      // Obter appId do sessionStorage ou env
      const appId = sessionStorage.getItem('app_product_id') || 
                    import.meta.env.VITE_PRODUCT_ID;

      if (!appId) {
        console.error('App ID não encontrado!');
        setAccessDenied(true);
        return;
      }

      // Verificar acesso
      const result = await checkSubscription(appId);

      if (result?.hasAccess) {
        setHasAccess(true);
      } else {
        setAccessDenied(true);
      }
    };

    verifyAccess();
  }, [user, authLoading, checkSubscription]);

  if (authLoading || subLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (accessDenied || !hasAccess) {
    return <AccessDeniedScreen />;
  }

  return (
    <div>
      <h1>Minha Aplicação</h1>
      {/* Seu conteúdo aqui */}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

---

## ✅ Checklist de Implementação

Use este checklist ao criar uma nova aplicação:

- [ ] **Configuração Inicial**
  - [ ] Cliente Supabase configurado
  - [ ] Variáveis de ambiente configuradas
  - [ ] `VITE_PRODUCT_ID` definido

- [ ] **Autenticação**
  - [ ] Contexto de autenticação implementado
  - [ ] Verificação de sessão funcionando
  - [ ] Logout implementado

- [ ] **Verificação de Acesso**
  - [ ] Hook/função de verificação implementada
  - [ ] `appId` sendo passado corretamente
  - [ ] Leitura do `sessionStorage` implementada
  - [ ] Fallback para `VITE_PRODUCT_ID` implementado

- [ ] **UI/UX**
  - [ ] Tela de loading durante verificação
  - [ ] Tela de acesso negado implementada
  - [ ] Links para portal funcionando

- [ ] **Testes**
  - [ ] Testado com usuário autenticado
  - [ ] Testado com usuário sem acesso
  - [ ] Testado com assinatura ativa
  - [ ] Testado com trial ativo
  - [ ] Testado acessando diretamente (sem passar pelo portal)

- [ ] **Deploy**
  - [ ] Variáveis de ambiente configuradas no Vercel/deploy
  - [ ] URL de deploy atualizada no portal
  - [ ] Testado em produção

---

## 🔧 Troubleshooting

### Problema: "appId é obrigatório"

**Causa:** O `appId` não está sendo passado para a verificação.

**Solução:**
1. Verifique se o portal está salvando o `appId` no `sessionStorage`
2. Verifique se a aplicação está lendo do `sessionStorage`
3. Verifique se `VITE_PRODUCT_ID` está configurado como fallback

### Problema: "Usuário não autenticado"

**Causa:** O usuário não está logado no Supabase.

**Solução:**
1. Verifique se o usuário fez login no portal
2. Verifique se a sessão do Supabase está sendo compartilhada
3. Verifique se as variáveis de ambiente do Supabase estão corretas

### Problema: Acesso negado mesmo com assinatura

**Causa:** O `appId` não corresponde ao produto da assinatura.

**Solução:**
1. Execute o script de diagnóstico SQL: `DIAGNOSTICO_ACESSO_USUARIO.sql`
2. Verifique se o `appId` usado corresponde ao `app_id` na tabela `user_purchases`
3. Verifique se a assinatura está com status `APPROVED`

### Problema: Edge Function retorna erro 400

**Causa:** Parâmetros obrigatórios faltando.

**Solução:**
1. Verifique se `userId`, `email` e `appId` estão sendo enviados
2. Verifique o formato do `appId` (deve ser UUID válido)
3. Verifique os logs da Edge Function no Supabase

---

## 📚 Referências

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Edge Function check-subscription](../supabase/functions/check-subscription/index.ts)
- [Script de Diagnóstico](../DIAGNOSTICO_ACESSO_USUARIO.sql)
- [Solução do Problema de Acesso](../SOLUCAO_PROBLEMA_ACESSO_APLICACAO.md)

---

## 🆘 Suporte

Se encontrar problemas:

1. Execute o script de diagnóstico SQL
2. Verifique os logs da Edge Function
3. Verifique o console do navegador
4. Confirme que todas as variáveis de ambiente estão configuradas
5. Verifique se o `appId` está correto

---

**Última atualização:** Dezembro 2024  
**Versão:** 2.0 (com correção do appId obrigatório)
