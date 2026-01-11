# 🧪 Como Testar a Função RPC - Guia Rápido

## ⚠️ Erro Comum

**Erro:** `invalid input syntax for type uuid: "[ID_DO_USUARIO]"`

**Causa:** Você tentou executar a query com o placeholder `[ID_DO_USUARIO]` sem substituir por um ID real.

---

## ✅ Solução

### **NUNCA use o placeholder literal `[ID_DO_USUARIO]`**

❌ **ERRADO:**
```sql
SELECT * FROM get_user_apps_status('[ID_DO_USUARIO]'::UUID);
```

✅ **CORRETO (use um ID real):**
```sql
SELECT * FROM get_user_apps_status('52c476c6-4edd-4f61-8f5e-599e067d6bc1'::UUID);
```

---

## 📋 IDs Disponíveis (dos seus usuários)

Você tem 5 usuários disponíveis. Use qualquer um deles:

1. **ADMIN** - `lwdigitalforge@gmail.com`
   - ID: `52c476c6-4edd-4f61-8f5e-599e067d6bc1`

2. **USER** - `lucas.psf.rinopolis@gmail.com`
   - ID: `5ac6a296-98bd-45a5-90d9-434c598a415b`

3. **USER** - `admin@lwdigitalforge.com`
   - ID: `2ba83f99-3a2e-4962-9d0c-e284e8225c45`

4. **USER** - `lucas05willian@hotmail.com`
   - ID: `7a796b16-9ba1-4157-a5c5-a25b325358ab`

5. **USER** - `lucas08willian@gmail.com`
   - ID: `86f65d7a-cd01-45ed-b816-f105b8c3752e`

---

## 🎯 Teste Recomendado

Execute esta query (já com ID real):

```sql
-- Testar com o usuário ADMIN
SELECT * FROM get_user_apps_status('52c476c6-4edd-4f61-8f5e-599e067d6bc1'::UUID);
```

**Ou use o arquivo:** `SQL_TESTAR_FUNCAO_EXEMPLO_REAL.sql` (já tem IDs reais prontos)

---

## 📊 Resultado Esperado

A função deve retornar:
- **id**: UUID do app
- **name**: Nome do app (ex: "JornadaPro")
- **slug**: Slug do app
- **description**: Descrição
- **image_url**: URL da imagem
- **vercel_deployment_url**: URL de deploy
- **has_access**: `true` ou `false`
- **access_type**: `'paid'`, `'trial'`, ou `NULL`
- **days_remaining**: Número de dias (se trial) ou `NULL`
- **trial_period_days**: 30 (padrão)

---

## ✅ Checklist

- [ ] Copiou um ID real (não o placeholder)
- [ ] Substituiu `[ID_DO_USUARIO]` pelo ID real
- [ ] Executou a query
- [ ] Verificou o resultado

---

## 💡 Dica

O arquivo `SQL_TESTAR_FUNCAO_EXEMPLO_REAL.sql` já tem exemplos prontos com IDs reais. Pode copiar e usar diretamente!
