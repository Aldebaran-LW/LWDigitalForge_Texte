# Solução: Usuário Não Consegue Acessar Aplicação

## 🔍 Problema Identificado

O usuário consegue fazer login no portal, mas quando tenta acessar uma aplicação (como JornadaPro), recebe a mensagem "Assinatura Necessária" mesmo tendo assinatura ativa ou período de teste.

## 🐛 Causa Raiz

O hook `useSubscription` estava chamando a Edge Function `check-subscription` **sem passar o `appId` ou `productId`**, que é **obrigatório** segundo a implementação da Edge Function.

A Edge Function retorna erro quando não recebe o `appId`:
```typescript
if (!targetAppId) {
  return new Response(
    JSON.stringify({
      error: "Bad Request",
      message: "appId ou productId é obrigatório para verificar acesso ao app específico",
    }),
    { status: 400 }
  );
}
```

## ✅ Correções Aplicadas

### 1. Hook `useSubscription` Atualizado

O hook agora:
- ✅ Aceita `appId` ou `productId` como parâmetro obrigatório
- ✅ Valida se o `appId` foi fornecido antes de fazer a requisição
- ✅ Envia o `appId` para a Edge Function

**Arquivo:** `src/hooks/useSubscription.jsx`

### 2. Componente Admin Atualizado

O componente `AdminCheckSubscription` agora:
- ✅ Tem campo para inserir o `appId`
- ✅ Valida se todos os campos (userId, email, appId) foram preenchidos
- ✅ Passa o `appId` para a verificação

**Arquivo:** `src/components/admin/AdminCheckSubscription.jsx`

### 3. Hook `useSubscriptionAccess` Atualizado

O hook agora:
- ✅ Aceita `appId` como parâmetro obrigatório
- ✅ Valida se o `appId` foi fornecido
- ✅ Passa o `appId` para `checkSubscription`

**Arquivo:** `src/hooks/useSubscription.jsx`

## 📋 Como Usar Corretamente

### No Portal (Frontend Principal)

Quando o usuário clica em "Acessar Aplicação", o `product.id` é salvo no `sessionStorage`:

```javascript
// PortalMeusProdutos.jsx e PortalTestes.jsx
sessionStorage.setItem('app_product_id', product.id);
```

### Na Aplicação (JornadaPro ou outras apps)

A aplicação deve ler o `appId` do `sessionStorage` e passar para a verificação:

```javascript
// Na aplicação (JornadaPro)
import { useSubscription } from '@/hooks/useSubscription';

function App() {
  const { user } = useAuth();
  const { checkSubscription, loading } = useSubscription();
  
  useEffect(() => {
    const verifyAccess = async () => {
      // Ler appId do sessionStorage (salvo pelo portal)
      const appId = sessionStorage.getItem('app_product_id');
      
      if (!appId) {
        // Redirecionar para página de assinatura necessária
        return;
      }
      
      // Verificar acesso com appId
      const result = await checkSubscription({ 
        userId: user.id, 
        email: user.email,
        appId: appId 
      });
      
      if (!result?.hasAccess) {
        // Redirecionar para página de assinatura necessária
        return;
      }
      
      // Permitir acesso
    };
    
    if (user) {
      verifyAccess();
    }
  }, [user, checkSubscription]);
}
```

### Usando o Hook `useSubscriptionAccess`

```javascript
import { useSubscriptionAccess } from '@/hooks/useSubscription';

function ProtectedComponent() {
  // Obter appId do sessionStorage ou props
  const appId = sessionStorage.getItem('app_product_id');
  
  const { hasAccess, loading, subscriptionData } = useSubscriptionAccess(appId);
  
  if (loading) {
    return <Loading />;
  }
  
  if (!hasAccess) {
    return <SubscriptionRequired />;
  }
  
  return <AppContent />;
}
```

## 🔧 Diagnóstico

Para diagnosticar problemas de acesso, use o script SQL:

**Arquivo:** `DIAGNOSTICO_ACESSO_USUARIO.sql`

Execute substituindo:
- `USER_ID_AQUI` pelo ID do usuário
- `APP_ID_AQUI` pelo ID do app/produto

O script verifica:
1. ✅ Se o usuário existe e tem perfil
2. ✅ Se há assinaturas ativas para o app
3. ✅ Se há testes ativos para o app
4. ✅ Se o app existe e está ativo
5. ✅ Resumo completo de acesso

## ⚠️ Importante

### Para Aplicações Existentes (JornadaPro, etc.)

Se a aplicação já está em produção e não está passando o `appId`, você precisa:

1. **Atualizar a aplicação** para ler o `appId` do `sessionStorage` ou receber via URL/props
2. **Passar o `appId`** para `checkSubscription` ou `useSubscriptionAccess`

### Alternativa Temporária

Se não puder atualizar a aplicação imediatamente, você pode:

1. Modificar a Edge Function para aceitar requisições sem `appId` (não recomendado)
2. Criar uma verificação alternativa que busca todos os apps do usuário

## 📝 Checklist de Verificação

- [x] Hook `useSubscription` atualizado para aceitar `appId`
- [x] Componente `AdminCheckSubscription` atualizado
- [x] Hook `useSubscriptionAccess` atualizado
- [x] Script de diagnóstico SQL criado
- [ ] Aplicações (JornadaPro, etc.) atualizadas para passar `appId`
- [ ] Testes realizados com usuário real

## 🚀 Próximos Passos

1. **Atualizar aplicações** para passar o `appId` na verificação
2. **Testar** com usuário que tem assinatura ativa
3. **Testar** com usuário que tem trial ativo
4. **Testar** com usuário sem acesso (deve bloquear corretamente)
5. **Verificar logs** da Edge Function para garantir que está recebendo `appId`

## 📞 Suporte

Se o problema persistir após essas correções:

1. Execute o script de diagnóstico SQL
2. Verifique os logs da Edge Function no Supabase
3. Verifique o console do navegador para erros
4. Confirme que o `appId` está sendo passado corretamente
