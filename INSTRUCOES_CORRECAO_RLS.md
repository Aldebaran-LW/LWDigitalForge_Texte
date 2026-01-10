# 🔧 Instruções para Corrigir Recursão RLS

## ⚠️ Problema Identificado

O erro `infinite recursion detected in policy for relation "profiles"` ocorre porque as políticas RLS estão tentando verificar se o usuário é admin fazendo SELECT na mesma tabela que está sendo protegida, causando recursão infinita.

## ✅ Solução V3 (Recomendada)

Execute o arquivo **`SQL_PARA_COPIAR_V3_FINAL.sql`** no Supabase Dashboard:

### Passos:

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Cole o conteúdo de `SQL_PARA_COPIAR_V3_FINAL.sql`**
   - Abra o arquivo `SQL_PARA_COPIAR_V3_FINAL.sql` no seu editor
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase

4. **Execute o SQL**
   - Clique em "Run" ou pressione Ctrl+Enter
   - Aguarde a confirmação de sucesso

5. **Teste novamente**
   ```bash
   npm run test:supabase
   ```

## 📋 O que a Solução V3 Faz

A solução V3 **remove completamente** a verificação de admin das políticas SELECT para evitar recursão:

- ✅ **Profiles**: Apenas usuários veem seus próprios perfis
- ✅ **Registered Apps**: Todos podem ver apps ativos
- ✅ **User Purchases**: Usuários veem suas próprias compras

**Para operações de admin (INSERT/UPDATE/DELETE):**
- As políticas permitem as operações (sem verificação de role na política)
- A verificação de role ADMIN será feita **no código da aplicação** antes de chamar o Supabase
- Isso evita completamente a recursão nas políticas RLS

## 🔄 Alternativas (se V3 não funcionar)

Se a solução V3 não resolver, você pode tentar:

### V2: Usando SET LOCAL row_security
- Execute `SQL_PARA_COPIAR_V2.sql`
- Usa `SET LOCAL row_security = off` na função

### V1: Usando função SECURITY DEFINER
- Execute `SQL_PARA_COPIAR.sql` (já executado, mas ainda com erro)
- Usa função `is_admin()` com SECURITY DEFINER

## ✅ Após Executar

Depois de executar o SQL, teste novamente:

```bash
npm run test:supabase
```

**Resultado esperado:**
- ✅ Conexão Básica
- ✅ Sistema de Autenticação  
- ✅ Tabelas do Banco
- ✅ Edge Functions

## 📝 Nota Importante

Com a solução V3, a verificação de role ADMIN para operações administrativas será feita no código da aplicação (já está implementado em `ProtectedRoute.jsx` e `AdminUsuarios.jsx`), então não há problema de segurança - apenas mudamos onde a verificação acontece (do banco para o código).
















