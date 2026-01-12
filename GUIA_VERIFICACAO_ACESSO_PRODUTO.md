# 🔒 Guia: Verificação de Acesso a Produtos/Apps

## 🎯 Como Funciona

Quando o usuário tenta acessar um produto/app, o sistema **verifica automaticamente** se ele tem acesso baseado nas tabelas do Supabase:

1. ✅ **Verifica `is_liberado`** na tabela `profiles`
2. ✅ **Verifica `data_vencimento`** (se não expirou ou é LIFETIME)
3. ✅ **Verifica compras ativas** na tabela `user_purchases`
4. ✅ **Verifica trials ativos** na tabela `user_trials`

**Se tem acesso** → Permite acesso ao produto  
**Se não tem acesso** → Mostra página "Assinatura Necessária"

---

## 📦 Componente Criado

### **`ProtectedProductRoute`**

Componente que protege rotas de produtos/apps e verifica acesso automaticamente.

**Localização:** `src/components/ProtectedProductRoute.jsx`

---

## 🔧 Como Usar

### **1. Proteger Rotas de Apps no App.jsx**

Adicione o componente `ProtectedProductRoute` nas rotas dos produtos:

```jsx
import ProtectedProductRoute from '@/components/ProtectedProductRoute';

// No seu App.jsx, adicione rotas protegidas:
<Route 
  path="/app/:id" 
  element={
    <ProtectedProductRoute>
      <AppComponent />
    </ProtectedProductRoute>
  } 
/>

// OU especificando o appId diretamente:
<Route 
  path="/jornada-pro" 
  element={
    <ProtectedProductRoute appId="e8ff7872-dedb-405c-bf8a-f7901ac4b432">
      <JornadaProApp />
    </ProtectedProductRoute>
  } 
/>
```

---

### **2. Proteger ao Clicar em "Acessar Produto"**

No componente que lista produtos (ex: `PortalMeusProdutos.jsx`), use `ProtectedProductRoute` ou verifique antes de navegar:

```jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const handleAccessProduct = async (appId) => {
  const { user, profile } = useAuth();
  
  // Verificar acesso
  if (profile?.is_liberado) {
    // Tem acesso, navegar para o app
    navigate(`/app/${appId}`);
  } else {
    // Verificar nas tabelas diretamente
    const { data: purchase } = await supabase
      .from('user_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('app_id', appId)
      .eq('status', 'APPROVED')
      .single();
    
    if (purchase) {
      navigate(`/app/${appId}`);
    } else {
      // Não tem acesso, mostrar página de assinatura
      navigate(`/assinatura-necessaria?app=${appId}`);
    }
  }
};
```

---

### **3. Verificar Acesso no Login Direto na App Web**

Quando o usuário faz login diretamente na aplicação web (ex: JornadaPro), adicione verificação no início da app:

```jsx
// No componente principal da app (ex: JornadaProApp.jsx)
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Navigate } from 'react-router-dom';

const APP_ID = 'e8ff7872-dedb-405c-bf8a-f7901ac4b432'; // ID do JornadaPro

const JornadaProApp = () => {
  const { user, profile } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Verificar is_liberado
      if (profile?.is_liberado) {
        const expiresAt = profile.data_vencimento 
          ? new Date(profile.data_vencimento)
          : null;
        
        if (!expiresAt || expiresAt > new Date() || expiresAt.toISOString() === '2099-01-01T00:00:00.000Z') {
          setHasAccess(true);
          setLoading(false);
          return;
        }
      }

      // Verificar nas tabelas
      const { data: purchase } = await supabase
        .from('user_purchases')
        .select('id, purchase_type, expires_at')
        .eq('user_id', user.id)
        .eq('app_id', APP_ID)
        .eq('status', 'APPROVED')
        .or('purchase_type.eq.LIFETIME,and(purchase_type.in.(MONTHLY,ANNUAL),expires_at.gt.' + new Date().toISOString() + ')')
        .single();

      const { data: trial } = await supabase
        .from('user_trials')
        .select('id')
        .eq('user_id', user.id)
        .eq('app_id', APP_ID)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      setHasAccess(!!purchase || !!trial);
      setLoading(false);
    };

    checkAccess();
  }, [user, profile]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!hasAccess) {
    return <Navigate to="/assinatura-necessaria" replace />;
  }

  // Renderizar app normalmente
  return (
    <div>
      {/* Conteúdo da app */}
    </div>
  );
};
```

---

## 📋 Lógica de Verificação

O componente `ProtectedProductRoute` verifica nesta ordem:

1. **`profile.is_liberado === true`** → Tem acesso
2. **`profile.data_vencimento > NOW()` ou `2099-01-01`** → Tem acesso (não expirou ou é LIFETIME)
3. **Compra LIFETIME ativa** → Tem acesso
4. **Compra MONTHLY/ANNUAL não expirada** → Tem acesso
5. **Trial ativo** → Tem acesso
6. **Nenhuma das condições** → Sem acesso → Mostra página "Assinatura Necessária"

---

## 🎨 Página "Assinatura Necessária"

A página exibe:
- 🔒 Ícone de cadeado
- 📝 Mensagem explicativa
- 🔗 Botão para "Ver Assinaturas Disponíveis"
- 🔗 Botão para "Ver Todos os Produtos"
- 🔗 Botão para "Voltar para o Dashboard"

---

## ✅ Fluxo Completo

```
Usuário clica em "Acessar Produto"
          ↓
ProtectedProductRoute verifica acesso
          ↓
    ┌─────┴─────┐
    │           │
  Tem acesso?  │
    │           │
    Sim        Não
    │           │
    ↓           ↓
Permite acesso  Mostra página
                "Assinatura
                Necessária"
```

---

## 🔄 Sincronização com Workflows n8n

Os workflows n8n atualizam o campo `is_liberado` automaticamente:

- **Workflow Automático** → Atualiza todos os usuários a cada hora
- **Workflow Manual** → Atualiza após criar trial/compra

Quando `is_liberado` é atualizado, o usuário pode:
1. Recarregar a página (F5)
2. Fazer logout e login novamente
3. O acesso será verificado automaticamente

---

## 🧪 Testando

1. **Criar trial/compra via workflow n8n**
2. **Aguardar alguns segundos** (para o trigger atualizar)
3. **Recarregar a página** ou fazer logout/login
4. **Tentar acessar o produto**
5. **Deve funcionar automaticamente!** ✅

---

**O sistema agora verifica acesso automaticamente usando as tabelas do Supabase!** 🚀
