# ✅ Próximos Passos Após a Migration

## Status Atual

✅ **Migration aplicada com sucesso!**

A mensagem "Success. No rows returned" é **normal e esperada** para uma migration DDL que apenas altera a estrutura das tabelas.

---

## 🔍 Passo 1: Verificar se a Migration Foi Aplicada

Execute o script `VERIFICAR_MIGRATION_APLICADA.sql` no SQL Editor do Supabase para confirmar que:

1. ✅ Coluna `slug` foi adicionada
2. ✅ Coluna `app_type` foi adicionada  
3. ✅ Constraint de `app_type` foi criada
4. ✅ Índices foram criados
5. ✅ JornadaPro foi atualizado (se o ID estiver correto)

---

## 📝 Passo 2: Atualizar Apps Existentes

### 2.1. Verificar Apps Existentes

Execute no SQL Editor:

```sql
SELECT id, name, slug, app_type, is_active
FROM public.registered_apps
ORDER BY created_at DESC;
```

### 2.2. Atualizar Cada App com Slug e App Type

Para cada app existente, execute:

```sql
-- Exemplo para um app (substitua os valores)
UPDATE public.registered_apps 
SET 
    slug = 'slug-do-app',  -- Ex: 'jornadapro', 'app-de-vendas', etc.
    app_type = 'WEB_APP'   -- ou 'INFO_PRODUTO'
WHERE id = 'uuid-do-app';
```

### 2.3. Verificar ID Correto do JornadaPro

Se o ID do JornadaPro for diferente de `e8ff7872-dedb-405c-bf8a-f7901ac4b432`, você precisa:

1. **Encontrar o ID correto:**
```sql
SELECT id, name, slug
FROM public.registered_apps
WHERE name ILIKE '%jornada%';
```

2. **Atualizar a migration** (se necessário):
   - Edite `supabase/migrations/20250111000000_add_slug_and_app_type.sql`
   - Substitua o ID na linha do UPDATE

3. **Ou atualizar manualmente:**
```sql
UPDATE public.registered_apps 
SET slug = 'jornadapro', app_type = 'WEB_APP' 
WHERE name ILIKE '%jornada%' OR id = 'seu-id-correto-aqui';
```

---

## 📋 Passo 3: Padrão para Novos Apps

Quando criar novos apps, sempre defina:

1. **`slug`**: URL amigável, único, minúsculo, sem espaços
   - ✅ Bom: `jornadapro`, `app-de-vendas`, `calculadora-financeira`
   - ❌ Ruim: `JornadaPro`, `app de vendas`, `app_de_vendas`

2. **`app_type`**: 
   - `'WEB_APP'` - Para aplicativos web
   - `'INFO_PRODUTO'` - Para infoprodutos

### Exemplo de Inserção:

```sql
INSERT INTO public.registered_apps (
    name,
    slug,              -- NOVO
    app_type,          -- NOVO
    description,
    price_monthly,
    price_annual,
    price_lifetime,
    is_active
) VALUES (
    'App de Vendas',
    'app-de-vendas',   -- URL amigável
    'WEB_APP',         -- Tipo de app
    'Descrição do app...',
    9900,  -- R$ 99,00 em centavos
    99000, -- R$ 990,00 em centavos
    199000, -- R$ 1.990,00 em centavos
    true
);
```

---

## 🎯 Passo 4: Verificar Edge Function

A Edge Function `check-subscription` já está deployada e funcionando! ✅

Teste novamente para garantir:

```powershell
npm run test:check-subscription:prod
```

---

## 📊 Passo 5: Checklist Final

- [ ] Migration aplicada (✅ Feito - "Success. No rows returned")
- [ ] Script de verificação executado (`VERIFICAR_MIGRATION_APLICADA.sql`)
- [ ] Campos `slug` e `app_type` confirmados
- [ ] JornadaPro atualizado com `slug='jornadapro'`
- [ ] Outros apps existentes atualizados com `slug` e `app_type`
- [ ] Edge Function testada e funcionando
- [ ] Documentação atualizada

---

## 🔧 Troubleshooting

### Problema: "Column already exists"

**Solução**: A migration já foi aplicada anteriormente. Isso é normal, continue para os próximos passos.

### Problema: JornadaPro não foi atualizado

**Solução**: 
1. Verifique o ID correto do JornadaPro
2. Atualize manualmente:
```sql
UPDATE public.registered_apps 
SET slug = 'jornadapro', app_type = 'WEB_APP' 
WHERE id = 'id-correto-do-jornadapro';
```

### Problema: Constraint não criada

**Solução**: Execute manualmente:
```sql
ALTER TABLE public.registered_apps 
ADD CONSTRAINT registered_apps_app_type_check 
CHECK (app_type IS NULL OR app_type IN ('WEB_APP', 'INFO_PRODUTO'));
```

---

## 📚 Documentação

- **Migration**: `supabase/migrations/20250111000000_add_slug_and_app_type.sql`
- **Estrutura do Banco**: `ESTRUTURA_BANCO_DADOS_SITE_PRINCIPAL.md`
- **Implementação**: `IMPLEMENTACAO_SISTEMA_HIBRIDO.md`

---

## ✅ Pronto!

Agora seu sistema está pronto para o **sistema híbrido** onde cada app tem controle de acesso independente!

Cada app pode ter seu próprio:
- ✅ Slug único para URLs amigáveis
- ✅ Tipo (WEB_APP ou INFO_PRODUTO)
- ✅ Controle de acesso independente via Edge Function

