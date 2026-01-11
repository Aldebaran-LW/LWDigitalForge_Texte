# 📋 Guia de Implementação - ProductCard Component

## 🎯 Objetivo

Criar um componente reutilizável `ProductCard` que:
- Verifica se o usuário tem acesso ao produto
- Mostra o botão apropriado (Entrar/Testar Grátis/Comprar)
- Gerencia a ativação de trials

---

## 📁 Arquivos Criados/Atualizados

### 1. **Componente Principal**
- **Arquivo:** `src/components/portal/ProductCard.jsx`
- **Status:** ✅ Criado

### 2. **SQL RLS**
- **Arquivo:** `SQL_RLS_USER_TRIALS_FINAL.sql`
- **Status:** ✅ Criado

---

## 🔧 Passos de Implementação

### **PASSO 1: Executar SQL no Supabase**

Execute o SQL em `SQL_RLS_USER_TRIALS_FINAL.sql` no SQL Editor do Supabase:

```sql
-- Garantir que usuários podem criar e ver seus próprios trials
-- (Ver arquivo completo)
```

**Resultado esperado:**
- ✅ Política "Users can insert their own trials" criada
- ✅ Política "Users can view their own trials" criada
- ✅ Política "Admins can manage all trials" criada

### **PASSO 2: Usar o Componente no PortalProdutos.jsx**

O componente `ProductCard` pode ser usado no lugar da lógica atual. Exemplo:

```jsx
import ProductCard from '@/components/portal/ProductCard';

// No render:
<ProductCard 
  app={product}
  userHasAccess={productAccessStates[product.id]?.hasAccess || false}
  subscriptionType={productAccessStates[product.id]?.accessType || null}
/>
```

### **PASSO 3: Integrar no PortalDashboard.jsx (Opcional)**

Se quiser usar no dashboard, adicione a busca de acessos:

```jsx
import { checkUserProductAccess } from '@/utils/trialHelpers';

// No useEffect:
const productAccessStates = {};
for (const product of products) {
  const { hasAccess, accessType } = await checkUserProductAccess(
    user.id, 
    product.id, 
    user.email
  );
  productAccessStates[product.id] = { hasAccess, accessType };
}
```

---

## 🎨 Características do Componente

### **Props**

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `app` | Object | Sim | Objeto do produto/app |
| `userHasAccess` | boolean | Não | Se o usuário já tem acesso |
| `subscriptionType` | string | Não | Tipo: 'trial', 'subscription', 'lifetime' |

### **Comportamento**

1. **Se `userHasAccess === true`:**
   - Mostra botão "Entrar no App" (verde)
   - Abre o app em nova aba ao clicar

2. **Se `userHasAccess === false`:**
   - Mostra botões "Testar Grátis" e "Comprar"
   - Ao clicar em "Testar Grátis":
     - Chama `startProductTrial()`
     - Mostra loading durante ativação
     - Recarrega a página após sucesso
     - Mostra toast de sucesso/erro

3. **Indicador de Trial:**
   - Se `subscriptionType === 'trial'`, mostra texto "Modo Trial Ativo"

---

## 🔍 Funções Utilizadas

### **`startProductTrial()`**
- **Localização:** `src/utils/trialHelpers.js`
- **Parâmetros:**
  - `userId` (string)
  - `productId` (string)
  - `productName` (string)
  - `trialPeriodDays` (number, padrão: 30)
  - `userEmail` (string, opcional)
- **Retorno:** `{ success: boolean, message: string, redirectUrl: string | null }`

### **Comportamento:**
- Verifica se já existe acesso
- Verifica se já existe trial anterior
- Cria trial na tabela `user_trials`
- Retorna resultado com mensagem

---

## 🧪 Testes

### **Teste 1: Criar Trial**

1. Faça login no Portal
2. Acesse `/portal/produtos`
3. Clique em "Testar Grátis" em um produto
4. **Verificar:**
   - Toast de sucesso aparece
   - Botão muda para "Entrar no App" após reload
   - Trial criado no banco de dados

### **Teste 2: Tentar Criar Trial Duplicado**

1. Tente criar trial para produto que já tem trial
2. **Verificar:**
   - Toast de erro aparece
   - Mensagem: "Já utilizou o seu período de teste para este produto."

### **Teste 3: Acessar com Trial Ativo**

1. Tenha um trial ativo
2. Acesse `/portal/produtos`
3. **Verificar:**
   - Botão "Entrar no App" aparece (verde)
   - Indicador "Modo Trial Ativo" aparece

---

## 🐛 Troubleshooting

### **Problema: "Permission Denied" ao criar trial**

**Causa:** Política RLS não permite INSERT

**Solução:**
1. Execute o SQL em `SQL_RLS_USER_TRIALS_FINAL.sql`
2. Verifique se a política foi criada:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'user_trials' 
   AND cmd = 'INSERT';
   ```

### **Problema: Botão não muda após criar trial**

**Causa:** Estado não é atualizado

**Solução:**
- O componente recarrega a página após 1.5s
- Se não recarregar, verifique se `result.success === true`
- Verifique logs do console para erros

### **Problema: URL do app não abre**

**Causa:** `app.vercel_deployment_url` não está definido

**Solução:**
1. Verifique se o produto tem `vercel_deployment_url` no banco
2. Verifique a query que busca produtos

---

## 📝 Notas Importantes

1. **Função `startProductTrial`:**
   - Já inclui validações (verifica se já tem acesso, se já teve trial, etc.)
   - Retorna mensagens de erro amigáveis
   - Cria trial com `is_active = true` e `expires_at` correto

2. **Recarregar Página:**
   - Após criar trial com sucesso, a página recarrega após 1.5s
   - Isso garante que o estado seja atualizado
   - Alternativa: Atualizar estado global/context ao invés de reload

3. **SQL RLS:**
   - Políticas permitem que usuários criem seus próprios trials
   - Admins podem gerenciar todos os trials
   - A constraint UNIQUE(user_id, app_id) impede duplicação

4. **Compatibilidade:**
   - O componente usa `startProductTrial` (função completa)
   - Se quiser usar `iniciarTrialGratis` (mais simples), ajuste o código

---

## ✅ Checklist de Implementação

- [ ] SQL RLS executado no Supabase SQL Editor
- [ ] Componente `ProductCard.jsx` criado em `src/components/portal/`
- [ ] Componente importado e usado no PortalProdutos.jsx (opcional)
- [ ] Teste de criação de trial realizado
- [ ] Teste de trial duplicado realizado
- [ ] Verificar se URL do app abre corretamente
- [ ] Verificar se indicador de trial aparece

---

## 🚀 Próximos Passos

1. Testar o componente em diferentes cenários
2. Integrar no PortalDashboard se necessário
3. Adicionar testes unitários se necessário
4. Documentar uso em outros lugares do portal
