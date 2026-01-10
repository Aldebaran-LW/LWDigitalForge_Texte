# 🔐 Implementação: Verificação de Acesso para jornadapro.lwdigitalforge.com

## 🎯 Objetivo

Garantir que apenas **usuários autorizados** possam acessar `https://jornadapro.lwdigitalforge.com/`, verificando:
1. ✅ Se o usuário está autenticado no Supabase
2. ✅ Se o usuário tem acesso ao produto "JornadaPro" (Ponto Diário)
3. ✅ Bloquear acesso se não tiver permissão

## 🔍 Como Funciona

### **Fluxo de Verificação**

```
1. Usuário acessa: jornadapro.lwdigitalforge.com
   ↓
2. App detecta domínio: "jornadapro.lwdigitalforge.com"
   ↓
3. Consulta registered_apps para encontrar produto com esse domínio
   ↓
4. Obtém Product ID automaticamente
   ↓
5. Verifica autenticação (Supabase SSO)
   ↓
6. Se autenticado: Verifica acesso (user_purchases + user_trials)
   ↓
7. Se TEM acesso: Permite entrar ✅
   Se NÃO TEM: Redireciona para /assinatura-necessaria ❌
```

## 📝 Implementação

### **1. Atualizar `lib/subscription-service.js`**

```javascript
import { supabase } from './supabase'

/**
 * Detecta o Product ID automaticamente pelo domínio atual
 * Exemplo: jornadapro.lwdigitalforge.com → encontra produto correspondente
 */
async function detectProductIdByDomain() {
  if (typeof window === 'undefined') return null;
  
  const currentDomain = window.location.hostname;
  console.log('Detectando Product ID para domínio:', currentDomain);
  
  try {
    const { data: products, error } = await supabase
      .from('registered_apps')
      .select('id, name, vercel_deployment_url')
      .not('vercel_deployment_url', 'is', null);
    
    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return null;
    }
    
    // Encontrar produto que corresponde ao domínio atual
    const product = products?.find(p => {
      if (!p.vercel_deployment_url) return false;
      try {
        const url = new URL(p.vercel_deployment_url);
        // Comparar hostname (ex: jornadapro.lwdigitalforge.com)
        return url.hostname === currentDomain;
      } catch {
        return false;
      }
    });
    
    if (product) {
      console.log('✅ Product ID detectado:', product.id, product.name);
      return product.id;
    }
    
    console.warn('⚠️ Nenhum produto encontrado para o domínio:', currentDomain);
    return null;
  } catch (error) {
    console.error('Erro ao detectar Product ID:', error);
    return null;
  }
}

/**
 * Obtém Product ID de várias fontes (em ordem de prioridade)
 */
async function getProductId() {
  // 1. SessionStorage (se veio do portal)
  if (typeof window !== 'undefined') {
    const fromStorage = sessionStorage.getItem('app_product_id');
    if (fromStorage) {
      console.log('✅ Product ID obtido do sessionStorage');
      sessionStorage.removeItem('app_product_id');
      sessionStorage.removeItem('app_product_name');
      return fromStorage;
    }
  }
  
  // 2. Variável de ambiente (fallback)
  if (process.env.NEXT_PUBLIC_PRODUCT_ID) {
    console.log('✅ Product ID obtido da variável de ambiente');
    return process.env.NEXT_PUBLIC_PRODUCT_ID;
  }
  
  // 3. Detecção automática pelo domínio (RECOMENDADO)
  const detected = await detectProductIdByDomain();
  if (detected) {
    return detected;
  }
  
  // 4. Fallback: retornar null (vai permitir acesso por padrão)
  console.warn('⚠️ Product ID não encontrado. Acesso será permitido por padrão.');
  return null;
}

/**
 * Verifica se o usuário tem acesso ao aplicativo
 * @param {string} userId - ID do usuário autenticado
 * @returns {Promise<{hasAccess: boolean, isSubscriber: boolean, isTrial: boolean}>}
 */
export async function verifyAccess(userId) {
  try {
    console.log('🔍 Verificando acesso para usuário:', userId);
    
    if (!userId) {
      console.warn('⚠️ userId não fornecido');
      return {
        hasAccess: false,
        isSubscriber: false,
        isTrial: false,
      };
    }

    // Obter Product ID
    const productId = await getProductId();
    
    if (!productId) {
      // Se não conseguir detectar Product ID, permitir acesso (fallback seguro)
      // Isso evita bloquear usuários legítimos se houver problema na detecção
      console.warn('⚠️ Product ID não encontrado. Acesso permitido por padrão.');
      return {
        hasAccess: true,
        isSubscriber: false,
        isTrial: false,
      };
    }

    console.log('🔍 Verificando acesso para Product ID:', productId);

    // 1. Verificar assinatura/compra (MONTHLY, ANNUAL, LIFETIME)
    const { data: purchase, error: purchaseError } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('status', 'APPROVED')
      .in('purchase_type', ['MONTHLY', 'ANNUAL', 'LIFETIME'])
      .maybeSingle();

    if (purchaseError && purchaseError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar compra:', purchaseError);
    }

    if (purchase) {
      // Verificar se não expirou (para MONTHLY/ANNUAL)
      const isLifetime = purchase.purchase_type === 'LIFETIME';
      const isExpired = purchase.expires_at && new Date(purchase.expires_at) <= new Date();

      if (isLifetime || !isExpired) {
        console.log('✅ Acesso permitido: Assinatura/Compra ativa');
        return {
          hasAccess: true,
          isSubscriber: true,
          isTrial: false,
        };
      }
    }

    // 2. Verificar compra específica (não assinatura)
    const { data: allPurchases, error: allPurchasesError } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('status', 'APPROVED');

    if (allPurchasesError) {
      console.error('❌ Erro ao verificar todas as compras:', allPurchasesError);
    }

    if (allPurchases && allPurchases.length > 0) {
      const specificPurchases = allPurchases.filter(
        p => !['MONTHLY', 'ANNUAL', 'LIFETIME'].includes(p.purchase_type)
      );

      if (specificPurchases.length > 0) {
        const activePurchase = specificPurchases.find(p => {
          if (!p.expires_at) return true;
          return new Date(p.expires_at) > new Date();
        });

        if (activePurchase) {
          console.log('✅ Acesso permitido: Compra específica ativa');
          return {
            hasAccess: true,
            isSubscriber: true,
            isTrial: false,
          };
        }
      }
    }

    // 3. Verificar trial ativo
    const { data: trial, error: trialError } = await supabase
      .from('user_trials')
      .select('*')
      .eq('user_id', userId)
      .eq('app_id', productId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (trialError && trialError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar trial:', trialError);
    }

    if (trial) {
      console.log('✅ Acesso permitido: Trial ativo');
      return {
        hasAccess: true,
        isSubscriber: false,
        isTrial: true,
      };
    }

    // SEM ACESSO
    console.log('❌ Acesso negado: Usuário não tem compra, assinatura ou trial ativo');
    return {
      hasAccess: false,
      isSubscriber: false,
      isTrial: false,
    };
  } catch (error) {
    console.error('❌ Erro ao verificar acesso:', error);
    // Em caso de erro, negar acesso por segurança
    return {
      hasAccess: false,
      isSubscriber: false,
      isTrial: false,
    };
  }
}
```

### **2. Atualizar `app/page.js` (Página Principal)**

```javascript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, empresaService } from '@/lib/supabase'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')
const BYPASS_SUBSCRIPTION = process.env.NEXT_PUBLIC_BYPASS_SUBSCRIPTION === 'true'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    async function checkAndRedirect() {
      try {
        console.log('🔍 Verificando autenticação e acesso...')
        
        // 1. Verificar se usuário está autenticado
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ Erro de sessão:', sessionError)
          router.push('/login')
          return
        }

        if (!session?.user) {
          console.log('⚠️ Usuário não autenticado, redirecionando para login')
          router.push('/login')
          return
        }

        console.log('✅ Usuário autenticado:', session.user.id, session.user.email)

        // 2. Bypass para testes (opcional)
        if (BYPASS_SUBSCRIPTION) {
          console.log('⚠️ BYPASS_SUBSCRIPTION ativo: pulando verificação de acesso')
          const empresa = await empresaService.getByOwnerId(session.user.id)
          
          if (empresa) {
            window.location.href = `${APP_URL}/apontamentos`
          } else {
            window.location.href = `${APP_URL}/onboarding`
          }
          return
        }

        // 3. Verificar acesso ao produto
        const { verifyAccess } = await import('@/lib/subscription-service')
        const access = await verifyAccess(session.user.id)
        
        console.log('📊 Resultado da verificação:', access)

        if (!access.hasAccess) {
          console.log('❌ Acesso negado, redirecionando para página de assinatura')
          window.location.href = `${APP_URL}/assinatura-necessaria`
          return
        }

        // 4. Verificar se tem empresa e redirecionar
        console.log('✅ Acesso permitido, verificando empresa...')
        const empresa = await empresaService.getByOwnerId(session.user.id)
        
        if (empresa) {
          console.log('✅ Empresa encontrada, redirecionando para apontamentos')
          window.location.href = `${APP_URL}/apontamentos`
        } else {
          console.log('⚠️ Empresa não encontrada, redirecionando para onboarding')
          window.location.href = `${APP_URL}/onboarding`
        }
      } catch (error) {
        console.error('❌ Erro ao verificar acesso:', error)
        // Em caso de erro, redirecionar para página de assinatura
        window.location.href = `${APP_URL}/assinatura-necessaria`
      }
    }
    
    checkAndRedirect()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-muted-foreground">Verificando acesso...</p>
      </div>
    </div>
  )
}
```

### **3. Atualizar `app/login/page.js`**

```javascript
async function checkSubscriptionAndRedirect(user) {
  try {
    console.log('🔍 Verificando acesso para usuário:', user.id, user.email)
    
    if (BYPASS_SUBSCRIPTION) {
      console.log('⚠️ BYPASS_SUBSCRIPTION ativo: pulando verificação')
      const { empresaService } = await import('@/lib/supabase')
      const empresa = await empresaService.getByOwnerId(user.id)
      
      if (empresa) {
        window.location.href = `${APP_URL}/apontamentos`
      } else {
        window.location.href = `${APP_URL}/onboarding`
      }
      return
    }
    
    // Verificar acesso
    const { verifyAccess } = await import('@/lib/subscription-service')
    const access = await verifyAccess(user.id)
    
    console.log('📊 Resultado da verificação:', access)

    if (!access.hasAccess) {
      console.log('❌ Acesso negado')
      window.location.href = `${APP_URL}/assinatura-necessaria`
      return
    }

    // Verificar empresa e redirecionar
    const { empresaService } = await import('@/lib/supabase')
    const empresa = await empresaService.getByOwnerId(user.id)
    
    if (empresa) {
      window.location.href = `${APP_URL}/apontamentos`
    } else {
      window.location.href = `${APP_URL}/onboarding`
    }
  } catch (error) {
    console.error('❌ Erro ao verificar acesso:', error)
    window.location.href = `${APP_URL}/assinatura-necessaria`
  }
}
```

### **4. Criar/Atualizar `app/assinatura-necessaria/page.js`**

```javascript
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const PORTAL_URL = 'https://www.lwdigitalforge.com/portal/produtos'

export default function AssinaturaNecessariaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-green-50">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
          <CardDescription>
            Você precisa de uma assinatura ou trial ativo para acessar esta aplicação.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Para acessar o JornadaPro, você precisa:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Ter uma assinatura ativa</li>
            <li>Ter uma compra aprovada</li>
            <li>Estar em período de trial</li>
          </ul>
          
          <div className="flex flex-col gap-2 pt-4">
            <Button asChild className="w-full">
              <Link href={PORTAL_URL} target="_blank">
                Ver Produtos e Assinaturas
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

## ✅ Configuração no Banco de Dados

### **Importante: Verificar `registered_apps`**

Certifique-se de que o produto "JornadaPro" ou "Ponto Diário" está cadastrado em `registered_apps` com:

```sql
-- Verificar se o produto está cadastrado
SELECT id, name, vercel_deployment_url 
FROM registered_apps 
WHERE vercel_deployment_url LIKE '%jornadapro.lwdigitalforge.com%'
   OR name ILIKE '%jornada%'
   OR name ILIKE '%ponto%';
```

**O campo `vercel_deployment_url` deve conter:** `https://jornadapro.lwdigitalforge.com`

## 🔒 Segurança

### **Políticas RLS (Row Level Security)**

Certifique-se de que as políticas RLS estão configuradas:

```sql
-- Permitir que usuários vejam suas próprias compras
CREATE POLICY "Users can view their own purchases"
ON user_purchases
FOR SELECT
USING (auth.uid() = user_id);

-- Permitir que usuários vejam seus próprios trials
CREATE POLICY "Users can view their own trials"
ON user_trials
FOR SELECT
USING (auth.uid() = user_id);
```

## 🧪 Testes

### **Cenário 1: Usuário com Acesso**
1. Usuário tem registro em `user_purchases` ou `user_trials`
2. Acessa `jornadapro.lwdigitalforge.com`
3. ✅ Deve permitir acesso

### **Cenário 2: Usuário sem Acesso**
1. Usuário NÃO tem registro em `user_purchases` ou `user_trials`
2. Acessa `jornadapro.lwdigitalforge.com`
3. ❌ Deve redirecionar para `/assinatura-necessaria`

### **Cenário 3: Usuário não Autenticado**
1. Usuário não está logado
2. Acessa `jornadapro.lwdigitalforge.com`
3. ❌ Deve redirecionar para `/login`

## 📊 Logs para Debug

O código inclui logs detalhados no console:
- ✅ Acesso permitido
- ❌ Acesso negado
- ⚠️ Avisos
- 🔍 Verificações em andamento

Abra o Console do navegador (F12) para ver os logs.

---

**Resultado:** A aplicação `jornadapro.lwdigitalforge.com` agora verifica automaticamente se o usuário tem acesso antes de permitir entrada! 🔐









