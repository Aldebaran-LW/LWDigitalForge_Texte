# 📝 Atualizar .env Manualmente

## ⚠️ Problema com CLI

O Supabase CLI está tendo problemas com o arquivo `.env` (encoding/caracteres inválidos).

---

## ✅ Solução: Editar .env Manualmente

### Passo a Passo:

1. **Abra o arquivo `.env`** no seu editor (VS Code, Notepad++, etc.)

2. **Localize a linha:**
   ```
   SUPABASE_ACCESS_TOKEN=sua_access_token_aqui
   ```

3. **Substitua por:**
   ```
   SUPABASE_ACCESS_TOKEN=sbp_17044a0c34e1a5bb6157319ea867e094c6ae0a12
   ```

4. **Salve o arquivo** com encoding UTF-8 (sem BOM)

---

## 📋 Verificação

Após atualizar, verifique se a linha está correta:

```
SUPABASE_ACCESS_TOKEN=sbp_17044a0c34e1a5bb6157319ea867e094c6ae0a12
```

---

## 🚀 Alternativa: Deploy via Dashboard

**Se o CLI continuar dando problemas, use o Dashboard:**

1. **Acesse:** https://app.supabase.com/
2. **Functions** → **check-subscription**
3. **Copie código** de `supabase/functions/check-subscription/index.ts`
4. **Cole no editor** do Dashboard
5. **Salve** (deploy automático)

---

**Esta é a forma mais confiável!** ✅
