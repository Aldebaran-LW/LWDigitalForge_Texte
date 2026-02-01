# 🔗 Guia de Integração com Portal - Aplicações

**Data:** 25 de Janeiro de 2026  
**Objetivo:** Integrar aplicação com o portal principal para acesso automático

---

## 📋 1. O Que Esta Integração Faz

Quando um usuário acessa sua aplicação **através do portal principal** (clicando em "Acessar Aplicação"), ele é autenticado automaticamente sem precisar fazer login novamente.

**Comportamento:**
- ✅ Usuário clica "Acessar Aplicação" no portal
- ✅ Portal verifica acesso e abre aplicação com hash de autenticação
- ✅ Aplicação detecta hash e autentica automaticamente
- ✅ Usuário vai direto para a rota padrão (sem ver tela de login)

**Se o usuário acessar diretamente** (sem passar pelo portal), o sistema de login normal funciona normalmente.

---

## 🔧 2. Passos de Implementação

### Passo 1: Copiar o Hook

Copie o arquivo `hook-usePortalAuth.js` para `src/hooks/usePortalAuth.js` na sua aplicação.

### Passo 2: Configurar o Hook

Edite `src/hooks/usePortalAuth.js` e configure:

```javascript
// ⚠️ CONFIGURAR: ID do produto desta aplicação
const PRODUCT_ID = 'SEU_PRODUCT_ID_AQUI'; 

// ⚠️ CONFIGURAR: Rota padrão da aplicação
const DEFAULT_ROUTE = '/sua-rota-padrao'; // Ex: '/apontamentos', '/dashboard', '/'
```

**Onde encontrar o PRODUCT_ID:**
- No portal principal, vá em Admin → Produtos
- Encontre seu produto e copie o ID
- Ou consulte o banco de dados Supabase na tabela `registered_apps`

**IDs Conhecidos:**
- **JornadaPro:** `e8ff7872-dedb-405c-bf8a-f7901ac4b432`
- **StockForge:** `0cb79942-0696-4c43-bae4-d2acc46804cd`
- **Ponto Diário:** (verificar no banco)

### Passo 3: Ajustar Caminho do Supabase

Verifique se o caminho do import está correto:

```javascript
import { supabase } from '@/lib/supabaseClient'; // Ajustar conforme necessário
```

Caminhos comuns:
- `@/lib/supabaseClient`
- `@/lib/supabase`
- `./lib/supabaseClient`
- `../lib/supabaseClient`

### Passo 4: Adicionar no App Principal

No arquivo principal da aplicação (geralmente `App.jsx`, `main.jsx` ou `index.jsx`), adicione:

```javascript
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { Loader2 } from 'lucide-react'; // ou outro componente de loading

function App() {
  // ADICIONAR: Verificar se veio do portal (opcional, não bloqueia se falhar)
  const { isChecking } = usePortalAuth();
  
  // Se estiver verificando, mostrar loading
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  // TODO O RESTO DO CÓDIGO PERMANECE IGUAL
  // Seu sistema de login atual continua funcionando normalmente
  
  return (
    <Router>
      {/* Suas rotas atuais - NÃO MODIFICAR */}
    </Router>
  );
}
```

**IMPORTANTE:** Não modifique nada mais. Apenas adicione essas linhas.

---

## ✅ 3. Checklist de Implementação

- [ ] Copiar `hook-usePortalAuth.js` para `src/hooks/usePortalAuth.js`
- [ ] Configurar `PRODUCT_ID` no hook
- [ ] Configurar `DEFAULT_ROUTE` no hook
- [ ] Ajustar caminho do import do Supabase
- [ ] Adicionar `usePortalAuth()` no App principal
- [ ] Adicionar loading enquanto verifica
- [ ] **Testar que login normal ainda funciona**
- [ ] **Testar acesso via portal**

---

## 🧪 4. Testes

### Teste 1: Login Normal (Deve Continuar Funcionando)
1. Limpar cookies/sessão
2. Acessar aplicação diretamente
3. **Resultado Esperado:**
   - Sistema de login atual funciona normalmente
   - Nada mudou do comportamento anterior

### Teste 2: Acesso via Portal
1. Login no portal principal
2. Ir para "Meus Produtos" ou "Testes Ativos"
3. Clicar em "Acessar Aplicação"
4. **Resultado Esperado:**
   - Aplicação abre em nova aba
   - Autentica automaticamente
   - Vai direto para rota padrão
   - Não mostra tela de login

### Teste 3: Hash Inválido (Fallback)
1. Modificar hash na URL para ser inválido
2. Acessar aplicação
3. **Resultado Esperado:**
   - Hook detecta hash inválido
   - **Não quebra** - sistema de login normal funciona
   - Usuário pode fazer login normalmente

---

## ⚠️ 5. Princípios Importantes

### ✅ O Que Fazer
1. **Adicionar** hook opcional
2. **Manter** todo o código de login existente intacto
3. **Testar** que login normal continua funcionando
4. **Garantir** que se hook falhar, login normal funciona

### ❌ O Que NÃO Fazer
1. **NÃO modificar** página de login existente
2. **NÃO modificar** lógica de autenticação existente
3. **NÃO modificar** rotas protegidas existentes
4. **NÃO remover** código existente
5. **NÃO fazer** mudanças que quebrem o comportamento atual

---

## 🔍 6. Troubleshooting

### Problema: Hook não funciona
**Solução:** Não é crítico. O login normal continua funcionando. Verifique:
- PRODUCT_ID está correto?
- Caminho do import do Supabase está correto?
- Hash está sendo passado corretamente pelo portal?

### Problema: Login normal parou de funcionar
**Solução:** Remova o hook temporariamente. O hook não deveria afetar o login normal. Se afetou, há um problema na implementação.

### Problema: Redirecionamento não funciona
**Solução:** Verifique se `DEFAULT_ROUTE` está correto e se a rota existe na aplicação.

---

## 📞 7. Informações de Referência

### Portal Principal
- **URL:** `https://lwdigitalforge.com`
- **Meus Produtos:** `/portal/meus-produtos`
- **Testes Ativos:** `/portal/testes`

### Estrutura do Hash
O portal passa estas informações via hash:

```javascript
{
  access_token: "eyJhbGci...",      // Token de autenticação do Supabase
  user_id: "uuid-do-usuario",        // ID do usuário
  product_id: "uuid-do-produto",     // ID do produto
  timestamp: 1234567890,             // Timestamp (validade: 5 minutos)
  from: "portal"                     // Indica que veio do portal
}
```

**Codificação:** Base64 (`btoa(JSON.stringify(authData))`)

**URL Final:**
```
https://sua-aplicacao.com/rota#auth=eyJhY2Nlc3NfdG9rZW4i...
```

---

## 📝 8. Exemplo Completo

### Arquivo: `src/hooks/usePortalAuth.js`

```javascript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const PRODUCT_ID = '0cb79942-0696-4c43-bae4-d2acc46804cd'; // StockForge
const DEFAULT_ROUTE = '/'; // Página inicial

export function usePortalAuth() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkPortalAuth();
  }, []);

  async function checkPortalAuth() {
    try {
      const hash = window.location.hash;
      if (!hash.includes('#auth=')) {
        setIsChecking(false);
        return;
      }

      const encodedAuth = hash.split('#auth=')[1];
      const authData = JSON.parse(atob(encodedAuth));
      
      if (authData.from !== 'portal') {
        setIsChecking(false);
        return;
      }
      
      const maxAge = 5 * 60 * 1000;
      if (Date.now() - authData.timestamp > maxAge) {
        setIsChecking(false);
        return;
      }
      
      const { error } = await supabase.auth.setSession({
        access_token: authData.access_token,
        refresh_token: ''
      });
      
      if (error || authData.product_id !== PRODUCT_ID) {
        setIsChecking(false);
        return;
      }
      
      window.history.replaceState(null, '', window.location.pathname);
      if (window.location.pathname === '/') {
        navigate(DEFAULT_ROUTE);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação do portal:', error);
    } finally {
      setIsChecking(false);
    }
  }

  return { isChecking };
}
```

### Arquivo: `src/App.jsx` (Adição Mínima)

```javascript
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { Loader2 } from 'lucide-react';

function App() {
  const { isChecking } = usePortalAuth();
  
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  // Resto do código permanece igual
  return (
    <Router>
      {/* Suas rotas */}
    </Router>
  );
}
```

---

**Documento gerado em:** 25 de Janeiro de 2026  
**Para:** Todas as aplicações futuras
