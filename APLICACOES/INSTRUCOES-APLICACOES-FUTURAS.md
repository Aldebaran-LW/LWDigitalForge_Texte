# 📚 Instruções para Aplicações Futuras

Este documento serve como referência para implementar a integração com o portal em **qualquer aplicação futura**.

---

## 🎯 Objetivo

Permitir que usuários acessem a aplicação através do portal principal sem precisar fazer login novamente.

---

## 📋 Passos Padrão (Para Qualquer Aplicação)

### 1. Obter Informações da Aplicação

Antes de começar, você precisa:

- **Product ID:** ID do produto no banco Supabase (tabela `registered_apps`)
- **Rota Padrão:** Rota principal da aplicação (ex: `/`, `/dashboard`, `/apontamentos`)
- **Caminho do Supabase:** Onde está o cliente Supabase na aplicação

**Como obter Product ID:**
```sql
SELECT id, name, slug FROM registered_apps WHERE name ILIKE '%nome-da-aplicacao%';
```

### 2. Copiar Arquivo Base

Copiar `hook-usePortalAuth.js` para `src/hooks/usePortalAuth.js` na aplicação.

### 3. Configurar o Hook

Editar `src/hooks/usePortalAuth.js`:

```javascript
// ⚠️ CONFIGURAR: ID do produto desta aplicação
const PRODUCT_ID = 'UUID_DO_PRODUTO'; 

// ⚠️ CONFIGURAR: Rota padrão da aplicação
const DEFAULT_ROUTE = '/sua-rota-padrao';
```

### 4. Ajustar Import do Supabase

Verificar onde está o cliente Supabase e ajustar:

```javascript
import { supabase } from '@/lib/supabaseClient'; // Ajustar conforme necessário
```

### 5. Adicionar no App Principal

No arquivo principal (geralmente `App.jsx` ou `main.jsx`):

```javascript
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { Loader2 } from 'lucide-react'; // ou outro componente de loading

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
    // Seu código atual
  );
}
```

### 6. Testar

Seguir `CHECKLIST-IMPLEMENTACAO.md` para garantir que nada quebrou.

---

## ✅ Checklist Mínimo

- [ ] Product ID configurado corretamente
- [ ] Rota padrão configurada corretamente
- [ ] Import do Supabase ajustado
- [ ] Hook adicionado no App principal
- [ ] Login normal continua funcionando
- [ ] Acesso via portal funciona

---

## 🔍 Troubleshooting Comum

### "Product ID não corresponde"
- Verificar se o Product ID está correto
- Consultar banco de dados Supabase

### "Erro ao autenticar com token do portal"
- Verificar se o Supabase está configurado corretamente
- Verificar se as credenciais do Supabase estão corretas

### "Login normal parou de funcionar"
- Remover hook temporariamente
- Verificar se não modificou código de login
- O hook não deveria afetar login normal

---

## 📝 Template de Configuração

Criar arquivo `NOME-APLICACAO-configuracao.md` com:

```markdown
# 🔧 Configuração - Nome da Aplicação

**Repositório:** https://github.com/...
**Product ID:** UUID_AQUI
**Rota Padrão:** /rota-padrao

## Passos
1. ...
2. ...
```

---

## 🎓 Lições Aprendidas

### ✅ Funciona Bem
- Adicionar hook como opção (não obrigatório)
- Manter código de login intacto
- Testar login normal primeiro

### ❌ Evitar
- Modificar código de login existente
- Tornar hook obrigatório
- Não testar login normal

---

## 📞 Suporte

Se tiver dúvidas:
1. Consultar `README-INTEGRACAO-PORTAL.md`
2. Seguir `CHECKLIST-IMPLEMENTACAO.md`
3. Verificar configurações de aplicações similares

---

**Documento criado em:** 25 de Janeiro de 2026  
**Para uso em:** Todas as aplicações futuras
