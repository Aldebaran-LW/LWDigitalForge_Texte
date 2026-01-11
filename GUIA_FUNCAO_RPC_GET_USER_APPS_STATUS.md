# 📋 Guia: Função RPC get_user_apps_status

## 🎯 Objetivo

Criar uma função RPC no Supabase que retorna todos os apps ativos com o status de acesso do usuário, fazendo join entre `registered_apps`, `user_purchases` e `user_trials` em uma única chamada.

---

## 📁 Arquivos

### 1. **Migration SQL**
- **Arquivo:** `supabase/migrations/20250112000000_create_get_user_apps_status_function.sql`
- **Status:** ✅ Criado (para usar com Supabase CLI)

### 2. **SQL para Executar Manualmente**
- **Arquivo:** `SQL_FUNCAO_GET_USER_APPS_STATUS.sql`
- **Status:** ✅ Criado (para copiar e colar no SQL Editor)

---

## 🔧 Como Usar

### **PASSO 1: Executar SQL no Supabase**

#### Opção A: SQL Editor (Recomendado para teste rápido)
1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Abra o arquivo `SQL_FUNCAO_GET_USER_APPS_STATUS.sql`
4. Copie e cole o conteúdo
5. Clique em **Run**

#### Opção B: Supabase CLI (Recomendado para produção)
```bash
supabase db push
```

### **PASSO 2: Testar a Função**

No SQL Editor, teste com um usuário:

```sql
-- Substitua [USER_ID] pelo ID de um usuário
SELECT * FROM get_user_apps_status('[USER_ID]'::UUID);
```

**Resultado esperado:**
- Lista de todos os apps ativos
- Cada app com `has_access`, `access_type`, `days_remaining`

### **PASSO 3: Usar no Frontend**

Exemplo de uso no React:

```javascript
import { supabase } from '@/lib/customSupabaseClient';

// Chamar a função RPC
const { data, error } = await supabase.rpc('get_user_apps_status', { 
  p_user_id: user.id 
});

if (error) {
  console.error('Erro:', error);
  return;
}

// data é um array de apps com:
// - id, name, slug, description, image_url, vercel_deployment_url
// - has_access (boolean)
// - access_type ('paid', 'trial', ou null)
// - days_remaining (integer ou null)
// - trial_period_days (integer, padrão 30)
```

---

## 📊 Estrutura de Retorno

A função retorna uma tabela com as seguintes colunas:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID do app |
| `name` | TEXT | Nome do app |
| `slug` | TEXT | Slug do app |
| `description` | TEXT | Descrição do app |
| `image_url` | TEXT | URL da imagem |
| `vercel_deployment_url` | TEXT | URL de deploy do app |
| `has_access` | BOOLEAN | Se o usuário tem acesso (paid ou trial) |
| `access_type` | TEXT | Tipo: 'paid', 'trial', ou NULL |
| `days_remaining` | INTEGER | Dias restantes do trial (NULL se não for trial) |
| `trial_period_days` | INTEGER | Período de trial padrão (30) |

---

## 🔍 Lógica da Função

### **1. Join com Compras (user_purchases)**
- Busca compras com `status = 'APPROVED'`
- Considera compras `LIFETIME` ou que não expiraram (`expires_at > now()`)
- Prioriza compras sobre trials

### **2. Join com Trials (user_trials)**
- Busca trials ativos (`is_active = true`)
- Apenas trials que não expiraram (`expires_at > now()`)
- Pega o trial mais recente (maior `expires_at`)

### **3. Determinação de Acesso**
- `has_access = true` se houver compra OU trial ativo
- `access_type = 'paid'` se houver compra
- `access_type = 'trial'` se houver apenas trial
- `access_type = NULL` se não houver acesso

### **4. Cálculo de Dias Restantes**
- Calcula apenas para trials
- `GREATEST(0, ...)` garante que nunca seja negativo
- Retorna `NULL` se não for trial

---

## 💡 Exemplo de Uso no PortalDashboard

```javascript
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import ProductCard from '@/components/portal/ProductCard';
import { Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/SupabaseAuthContext';

export default function PortalDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Chamada única para a função SQL
        const { data, error } = await supabase.rpc('get_user_apps_status', { 
          p_user_id: user.id 
        });

        if (error) throw error;
        setApps(data || []);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">As Minhas Aplicações</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map(app => (
          <ProductCard 
            key={app.id} 
            app={app} 
            userHasAccess={app.has_access} 
            subscriptionType={app.access_type}
            daysRemaining={app.days_remaining}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### **Problema: "function get_user_apps_status does not exist"**

**Causa:** Função não foi criada no banco

**Solução:**
1. Execute o SQL no SQL Editor do Supabase
2. Verifique se a função foi criada:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'get_user_apps_status';
   ```

### **Problema: "permission denied for function get_user_apps_status"**

**Causa:** Permissão não foi concedida

**Solução:**
1. Execute o comando `GRANT EXECUTE` novamente:
   ```sql
   GRANT EXECUTE ON FUNCTION get_user_apps_status(UUID) TO authenticated;
   ```

### **Problema: "has_access sempre false"**

**Causa:** Lógica de join pode estar incorreta

**Solução:**
1. Teste a função diretamente no SQL:
   ```sql
   SELECT * FROM get_user_apps_status('[USER_ID]'::UUID);
   ```
2. Verifique se o usuário tem compras/trials:
   ```sql
   SELECT * FROM user_purchases WHERE user_id = '[USER_ID]';
   SELECT * FROM user_trials WHERE user_id = '[USER_ID]';
   ```

### **Problema: "days_remaining negativo"**

**Causa:** Trial expirado não está sendo filtrado

**Solução:**
- A função usa `GREATEST(0, ...)` para garantir que nunca seja negativo
- Trials expirados não devem aparecer (filtro `expires_at > now()`)

---

## ⚡ Vantagens da Função RPC

1. **Performance:**
   - Uma única query ao invés de múltiplas
   - Join feito no banco (mais rápido)
   - Reduz chamadas de rede

2. **Simplicidade:**
   - Lógica centralizada no banco
   - Frontend mais simples
   - Fácil de manter

3. **Consistência:**
   - Mesma lógica para todos os clientes
   - Menos risco de inconsistências
   - Fácil de testar

---

## ✅ Checklist

- [ ] SQL executado no Supabase SQL Editor
- [ ] Função criada e testada
- [ ] Permissões concedidas (authenticated)
- [ ] Testado com usuário real
- [ ] Integrado no frontend (opcional)
- [ ] Verificado comportamento com múltiplos apps

---

## 🚀 Próximos Passos

1. Executar o SQL no Supabase
2. Testar a função com um usuário
3. Integrar no PortalDashboard (se desejar)
4. Comparar performance com abordagem anterior
5. Documentar uso em outros lugares do portal
