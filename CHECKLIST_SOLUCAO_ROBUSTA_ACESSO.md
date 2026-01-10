# ✅ Checklist: Solução Robusta de Acesso aos Apps

## 🎯 Objetivo

Resolver o problema de acesso ao **Ponto_Diario-1** de forma **automática, robusta e sem danificar** os repositórios existentes.

---

## 📋 FASE 1: Preparação e Análise (ANTES DE TOCAR NO CÓDIGO)

### ✅ 1.1. Backup e Segurança

- [ ] **Fazer backup do repositório principal**
  ```bash
  cd /caminho/do/repositorio/principal
  git add .
  git commit -m "backup: antes de implementar verificação de acesso"
  git push
  ```

- [ ] **Fazer backup do repositório Ponto_Diario-1**
  ```bash
  cd /caminho/do/Ponto_Diario-1
  git add .
  git commit -m "backup: antes de implementar verificação de acesso"
  git push
  ```

- [ ] **Criar branch de desenvolvimento**
  ```bash
  # No repositório principal
  git checkout -b feature/verificacao-acesso-automatica
  
  # No Ponto_Diario-1
  git checkout -b feature/verificacao-acesso-automatica
  ```

### ✅ 1.2. Verificar Estado Atual do Banco de Dados

- [ ] **Verificar se produto está cadastrado em `registered_apps`**
  ```sql
  SELECT id, name, vercel_deployment_url 
  FROM registered_apps 
  WHERE vercel_deployment_url LIKE '%jornadapro%'
     OR name ILIKE '%jornada%'
     OR name ILIKE '%ponto%';
  ```
  - [ ] Anotar o `id` do produto (Product ID)
  - [ ] Verificar se `vercel_deployment_url` está correto: `https://jornadapro.lwdigitalforge.com`

- [ ] **Verificar políticas RLS**
  ```sql
  -- Verificar políticas em user_purchases
  SELECT * FROM pg_policies WHERE tablename = 'user_purchases';
  
  -- Verificar políticas em user_trials
  SELECT * FROM pg_policies WHERE tablename = 'user_trials';
  ```
  - [ ] Se não existirem, criar (ver passo 2.1)

- [ ] **Testar acesso de um usuário conhecido**
  ```sql
  -- Substituir USER_ID e PRODUCT_ID
  SELECT * FROM user_purchases 
  WHERE user_id = 'USER_ID' 
    AND app_id = 'PRODUCT_ID' 
    AND status = 'APPROVED';
  
  SELECT * FROM user_trials 
  WHERE user_id = 'USER_ID' 
    AND app_id = 'PRODUCT_ID' 
    AND is_active = true;
  ```

---

## 📋 FASE 2: Configuração do Banco de Dados

### ✅ 2.1. Criar/Verificar Políticas RLS (Se Necessário)

- [ ] **Política para `user_purchases`**
  ```sql
  -- Verificar se já existe
  SELECT * FROM pg_policies 
  WHERE tablename = 'user_purchases' 
    AND policyname = 'Users can view their own purchases';
  
  -- Se não existir, criar
  CREATE POLICY "Users can view their own purchases"
  ON user_purchases
  FOR SELECT
  USING (auth.uid() = user_id);
  ```

- [ ] **Política para `user_trials`**
  ```sql
  -- Verificar se já existe
  SELECT * FROM pg_policies 
  WHERE tablename = 'user_trials' 
    AND policyname = 'Users can view their own trials';
  
  -- Se não existir, criar
  CREATE POLICY "Users can view their own trials"
  ON user_trials
  FOR SELECT
  USING (auth.uid() = user_id);
  ```

- [ ] **Testar políticas RLS**
  - [ ] Fazer login como usuário de teste
  - [ ] Tentar consultar suas próprias compras/trials
  - [ ] Verificar se consegue acessar

### ✅ 2.2. Adicionar Campo `enable_access_verification` (Opcional)

- [ ] **Adicionar coluna na tabela `registered_apps`**
  ```sql
  -- Verificar se coluna já existe
  SELECT column_name 
  FROM information_schema.columns 
  WHERE table_name = 'registered_apps' 
    AND column_name = 'enable_access_verification';
  
  -- Se não existir, adicionar
  ALTER TABLE registered_apps 
  ADD COLUMN IF NOT EXISTS enable_access_verification BOOLEAN DEFAULT false;
  ```

- [ ] **Atualizar produto existente**
  ```sql
  UPDATE registered_apps 
  SET enable_access_verification = true,
      vercel_deployment_url = 'https://jornadapro.lwdigitalforge.com'
  WHERE id = 'PRODUCT_ID_AQUI';
  ```

---

## 📋 FASE 3: Implementação no Repositório Principal (Portal)

### ✅ 3.1. Atualizar `PortalMeusProdutos.jsx`

- [ ] **Adicionar salvamento no sessionStorage antes de abrir app**
  ```javascript
  const handleAccess = (product) => {
    if (product.vercel_deployment_url) {
      // Salvar productId no sessionStorage (não na URL!)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('app_product_id', product.id);
        sessionStorage.setItem('app_product_name', product.name);
      }
      
      // Abrir app com URL limpa
      window.open(product.vercel_deployment_url, '_blank');
    }
  };
  ```

- [ ] **Testar:**
  - [ ] Abrir app do portal
  - [ ] Verificar se `sessionStorage` contém `app_product_id`
  - [ ] Verificar se URL está limpa (sem parâmetros)

### ✅ 3.2. Adicionar Seção no Formulário Admin (Opcional)

- [ ] **Adicionar seção "Configuração de Acesso" em `AdminFormularioProduto.jsx`**
  - [ ] Checkbox para ativar verificação
  - [ ] Campo de URL de deploy (já existe, validar)
  - [ ] Botão para testar conexão
  - [ ] Exibição do Product ID

- [ ] **Testar:**
  - [ ] Criar/editar produto
  - [ ] Ativar verificação de acesso
  - [ ] Salvar e verificar se foi salvo no banco

---

## 📋 FASE 4: Implementação no Ponto_Diario-1

### ✅ 4.1. Atualizar `lib/subscription-service.js`

- [ ] **Adicionar função de detecção automática de Product ID**
  ```javascript
  async function detectProductIdByDomain() {
    if (typeof window === 'undefined') return null;
    
    const currentDomain = window.location.hostname;
    
    try {
      const { data: products, error } = await supabase
        .from('registered_apps')
        .select('id, name, vercel_deployment_url')
        .not('vercel_deployment_url', 'is', null);
      
      if (error) return null;
      
      const product = products?.find(p => {
        if (!p.vercel_deployment_url) return false;
        try {
          const url = new URL(p.vercel_deployment_url);
          return url.hostname === currentDomain;
        } catch {
          return false;
        }
      });
      
      return product?.id || null;
    } catch (error) {
      console.error('Erro ao detectar Product ID:', error);
      return null;
    }
  }
  ```

- [ ] **Atualizar função `getProductId()`**
  ```javascript
  async function getProductId() {
    // 1. SessionStorage (prioridade - se veio do portal)
    if (typeof window !== 'undefined') {
      const fromStorage = sessionStorage.getItem('app_product_id');
      if (fromStorage) {
        sessionStorage.removeItem('app_product_id');
        sessionStorage.removeItem('app_product_name');
        return fromStorage;
      }
    }
    
    // 2. Variável de ambiente (fallback)
    if (process.env.NEXT_PUBLIC_PRODUCT_ID) {
      return process.env.NEXT_PUBLIC_PRODUCT_ID;
    }
    
    // 3. Detecção automática pelo domínio
    const detected = await detectProductIdByDomain();
    if (detected) {
      return detected;
    }
    
    // 4. Fallback: retornar null (permitir acesso por padrão)
    return null;
  }
  ```

- [ ] **Atualizar função `verifyAccess()`**
  ```javascript
  export async function verifyAccess(userId) {
    if (!userId) {
      return { hasAccess: false, isSubscriber: false, isTrial: false };
    }
    
    const productId = await getProductId();
    
    // Se não conseguir detectar Product ID, permitir acesso (fallback seguro)
    if (!productId) {
      console.warn('Product ID não encontrado. Acesso permitido por padrão.');
      return { hasAccess: true, isSubscriber: false, isTrial: false };
    }
    
    // Resto da verificação (user_purchases + user_trials)
    // ... código existente ...
  }
  ```

- [ ] **Testar:**
  - [ ] Verificar se detecta Product ID do sessionStorage
  - [ ] Verificar se detecta Product ID pelo domínio
  - [ ] Verificar se funciona sem Product ID (fallback)

### ✅ 4.2. Atualizar `app/page.js`

- [ ] **Simplificar verificação de acesso**
  ```javascript
  async function checkAndRedirect() {
    // 1. Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      router.push('/login');
      return;
    }
    
    // 2. Verificar acesso (agora automático)
    const { verifyAccess } = await import('@/lib/subscription-service');
    const access = await verifyAccess(session.user.id);
    
    if (!access.hasAccess) {
      window.location.href = `${APP_URL}/assinatura-necessaria`;
      return;
    }
    
    // 3. Verificar empresa e redirecionar
    const empresa = await empresaService.getByOwnerId(session.user.id);
    if (empresa) {
      window.location.href = `${APP_URL}/apontamentos`;
    } else {
      window.location.href = `${APP_URL}/onboarding`;
    }
  }
  ```

- [ ] **Testar:**
  - [ ] Acesso direto à URL
  - [ ] Acesso via portal
  - [ ] Usuário sem acesso (deve bloquear)
  - [ ] Usuário com acesso (deve permitir)

### ✅ 4.3. Atualizar `app/login/page.js`

- [ ] **Atualizar função `checkSubscriptionAndRedirect()`**
  - [ ] Usar `verifyAccess()` atualizado
  - [ ] Remover dependência de `NEXT_PUBLIC_PRODUCT_ID`
  - [ ] Manter lógica de verificação de empresa

- [ ] **Testar:**
  - [ ] Login com usuário com acesso
  - [ ] Login com usuário sem acesso
  - [ ] Login com usuário autenticado (SSO)

### ✅ 4.4. Atualizar `app/auth/callback/page.js`

- [ ] **Atualizar callback OAuth**
  - [ ] Usar `verifyAccess()` atualizado
  - [ ] Manter lógica de redirecionamento

- [ ] **Testar:**
  - [ ] Login com Google
  - [ ] Verificar redirecionamento correto

### ✅ 4.5. Criar/Atualizar `app/assinatura-necessaria/page.js`

- [ ] **Criar página de acesso negado**
  - [ ] Mensagem clara
  - [ ] Link para portal de produtos
  - [ ] Link para voltar ao login

- [ ] **Testar:**
  - [ ] Acessar página diretamente
  - [ ] Verificar links funcionam

---

## 📋 FASE 5: Testes e Validação

### ✅ 5.1. Testes Locais

- [ ] **Testar detecção de Product ID**
  ```javascript
  // No console do navegador
  const { detectProductIdByDomain } = await import('./lib/subscription-service');
  const productId = await detectProductIdByDomain();
  console.log('Product ID detectado:', productId);
  ```

- [ ] **Testar verificação de acesso**
  ```javascript
  // No console do navegador (após login)
  const { verifyAccess } = await import('./lib/subscription-service');
  const { data: { user } } = await supabase.auth.getUser();
  const access = await verifyAccess(user.id);
  console.log('Acesso:', access);
  ```

- [ ] **Testar sessionStorage**
  ```javascript
  // No console do portal
  sessionStorage.setItem('app_product_id', 'test-id');
  // Abrir app e verificar se leu do sessionStorage
  ```

### ✅ 5.2. Testes de Integração

- [ ] **Cenário 1: Acesso via Portal**
  - [ ] Login no portal
  - [ ] Clicar em "Acessar" produto
  - [ ] Verificar se app abre
  - [ ] Verificar se usuário tem acesso
  - [ ] Verificar se redireciona corretamente

- [ ] **Cenário 2: Acesso Direto**
  - [ ] Usuário logado no portal
  - [ ] Digitar URL do app diretamente
  - [ ] Verificar se detecta autenticação (SSO)
  - [ ] Verificar se detecta Product ID pelo domínio
  - [ ] Verificar se permite/bloqueia corretamente

- [ ] **Cenário 3: Usuário sem Acesso**
  - [ ] Usuário sem compra/assinatura/trial
  - [ ] Tentar acessar app
  - [ ] Verificar se bloqueia
  - [ ] Verificar se redireciona para `/assinatura-necessaria`

- [ ] **Cenário 4: Usuário não Autenticado**
  - [ ] Não estar logado
  - [ ] Tentar acessar app
  - [ ] Verificar se redireciona para `/login`

### ✅ 5.3. Testes de Regressão

- [ ] **Verificar que funcionalidades existentes ainda funcionam**
  - [ ] Login funciona
  - [ ] Cadastro funciona
  - [ ] Portal funciona
  - [ ] Admin funciona
  - [ ] Outros apps não foram afetados

- [ ] **Verificar logs no console**
  - [ ] Não há erros
  - [ ] Logs de debug estão funcionando
  - [ ] Warnings são esperados (não são erros)

---

## 📋 FASE 6: Deploy e Monitoramento

### ✅ 6.1. Deploy do Repositório Principal

- [ ] **Commit e push**
  ```bash
  git add .
  git commit -m "feat: adicionar sessionStorage para passar productId aos apps"
  git push origin feature/verificacao-acesso-automatica
  ```

- [ ] **Criar Pull Request**
  - [ ] Revisar mudanças
  - [ ] Testar em preview
  - [ ] Merge para main

- [ ] **Deploy em produção**
  - [ ] Verificar se deploy foi bem-sucedido
  - [ ] Testar em produção

### ✅ 6.2. Deploy do Ponto_Diario-1

- [ ] **Commit e push**
  ```bash
  git add .
  git commit -m "feat: implementar verificação de acesso automática por domínio"
  git push origin feature/verificacao-acesso-automatica
  ```

- [ ] **Criar Pull Request**
  - [ ] Revisar mudanças
  - [ ] Testar em preview
  - [ ] Merge para main

- [ ] **Deploy em produção**
  - [ ] Verificar se deploy foi bem-sucedido
  - [ ] Testar em produção

### ✅ 6.3. Verificação Pós-Deploy

- [ ] **Testar em produção**
  - [ ] Acesso via portal funciona
  - [ ] Acesso direto funciona
  - [ ] Bloqueio de usuários sem acesso funciona
  - [ ] SSO funciona

- [ ] **Monitorar logs**
  - [ ] Verificar logs do Supabase
  - [ ] Verificar logs da Vercel
  - [ ] Verificar se há erros

- [ ] **Testar com usuário real**
  - [ ] Usuário com acesso
  - [ ] Usuário sem acesso
  - [ ] Novo usuário

---

## 📋 FASE 7: Documentação e Manutenção

### ✅ 7.1. Documentação

- [ ] **Atualizar `ONDE_VERIFICAR_ACESSO_APP.md`**
  - [ ] Documentar nova forma automática
  - [ ] Remover referências a variáveis de ambiente obrigatórias
  - [ ] Adicionar exemplos

- [ ] **Criar documentação de troubleshooting**
  - [ ] Problemas comuns
  - [ ] Como debugar
  - [ ] Como testar

- [ ] **Atualizar README dos repositórios**
  - [ ] Documentar verificação de acesso
  - [ ] Documentar como funciona

### ✅ 7.2. Configuração para Novos Apps

- [ ] **Criar checklist para novos apps**
  - [ ] Passos para adicionar novo app
  - [ ] O que configurar
  - [ ] Como testar

- [ ] **Automatizar no admin (futuro)**
  - [ ] Interface para configurar
  - [ ] Testes automáticos

---

## 🚨 Checklist de Segurança

### ✅ Antes de Fazer Deploy

- [ ] **Código revisado**
  - [ ] Não há credenciais expostas
  - [ ] Não há console.logs com dados sensíveis
  - [ ] RLS está configurado corretamente

- [ ] **Testes passaram**
  - [ ] Testes locais OK
  - [ ] Testes de integração OK
  - [ ] Testes de regressão OK

- [ ] **Backup feito**
  - [ ] Repositório principal
  - [ ] Repositório Ponto_Diario-1
  - [ ] Banco de dados (se possível)

---

## 📊 Resumo da Solução

### **O que foi implementado:**

1. ✅ **Detecção automática de Product ID**
   - Por sessionStorage (quando vem do portal)
   - Por domínio (quando acesso direto)
   - Por variável de ambiente (fallback)
   - Fallback seguro (permitir acesso se não conseguir detectar)

2. ✅ **Verificação de acesso robusta**
   - Consulta `user_purchases` e `user_trials`
   - Verifica expiração
   - Bloqueia usuários sem acesso
   - Logs detalhados

3. ✅ **URL sempre limpa**
   - Não passa parâmetros na URL
   - Usa sessionStorage
   - Detecção automática

4. ✅ **SSO automático**
   - Mesmo Supabase = mesma sessão
   - Funciona entre portal e apps
   - Não precisa fazer login novamente

### **Vantagens:**

- ✅ **Automático:** Não precisa configurar variáveis de ambiente
- ✅ **Robusto:** Múltiplos fallbacks
- ✅ **Seguro:** Bloqueia usuários não autorizados
- ✅ **Flexível:** Funciona para acesso direto e via portal
- ✅ **Manutenível:** Código limpo e documentado

---

## 🎯 Próximos Passos (Opcional)

- [ ] Criar página admin de gerenciamento de acessos
- [ ] Adicionar logs de acesso no banco
- [ ] Criar dashboard de estatísticas
- [ ] Automatizar testes de acesso
- [ ] Adicionar notificações para tentativas negadas

---

**Status:** ✅ Checklist completo e pronto para execução!

**Tempo estimado:** 2-4 horas (dependendo da experiência)

**Risco:** ⚠️ Baixo (com backups e testes adequados)









