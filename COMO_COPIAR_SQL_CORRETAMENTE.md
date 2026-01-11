# ⚠️ Como Copiar SQL Corretamente no Supabase

## 🚨 Erro Comum

**Erro:** `syntax error at or near "```"`

**Causa:** Você copiou o SQL com os blocos de código markdown (```sql e ```)

---

## ✅ Solução

### **NUNCA copie os blocos de código markdown**

❌ **ERRADO:**
```sql
SELECT id, name, is_active 
FROM registered_apps 
WHERE is_active = true;
```

✅ **CORRETO (copie apenas isso):**
```sql
SELECT id, name, is_active 
FROM registered_apps 
WHERE is_active = true;
```

---

## 📋 Regra Simples

**No Supabase SQL Editor:**
1. ✅ Copie apenas o código SQL
2. ❌ NÃO copie os ```sql no início
3. ❌ NÃO copie os ``` no final
4. ✅ Cole apenas o SQL puro

---

## 💡 Dica

Use os arquivos `.sql` que criei - eles já têm apenas SQL puro, sem markdown:

- `SQL_TESTAR_APPS_ATIVOS.sql` - Query simples para testar
- `SQL_TESTAR_FUNCAO_COMPLETO.sql` - Teste completo da função
- `SQL_FUNCAO_GET_USER_APPS_STATUS.sql` - Função RPC (pode copiar tudo deste)

---

## 🔍 Exemplo Visual

**Quando você vê isso na documentação:**
````markdown
```sql
SELECT * FROM tabela;
```
````

**Copie APENAS isto:**
```sql
SELECT * FROM tabela;
```

**E NÃO copie isto:**
- ❌ ```sql (no início)
- ❌ ``` (no final)
- ❌ Qualquer texto markdown

---

## ✅ Checklist

- [ ] Abriu o arquivo `.sql` ou copiou apenas o código SQL
- [ ] NÃO copiou os ```sql e ```
- [ ] Colou no Supabase SQL Editor
- [ ] Clicou em "Run"
- [ ] Não teve erro de sintaxe
