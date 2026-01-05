# 🔍 Explicação: Product ID - Supabase ou Vercel?

## ❓ Pergunta

**Product ID é o ID da Vercel ou da Supabase?**

## ✅ Resposta

**Product ID é o ID da Supabase (UUID da tabela `registered_apps`), NÃO é da Vercel.**

---

## 📊 Estrutura de Dados

### Tabela `registered_apps` (Supabase)

Cada produto tem:
- **`id`** (UUID) - Este é o **Product ID** ✅
- **`name`** - Nome do produto
- **`vercel_deployment_url`** - URL do app na Vercel (ex: `https://app.vercel.app`)
- Outros campos...

**Exemplo:**
```javascript
{
  id: "e8ff7872-dedb-405c-bf8a-f7901a1b4c32",  // ← Este é o Product ID
  name: "Meu App",
  vercel_deployment_url: "https://meu-app.vercel.app"
}
```

---

## 🔄 Como Funciona Atualmente

### 1. **No Admin (Cadastro de Produto)**

Quando você cadastra um produto no admin:
1. Preenche o formulário (nome, descrição, URL da Vercel, etc.)
2. Salva no Supabase
3. Supabase **gera automaticamente** um UUID para o campo `id`
4. Esse UUID é o **Product ID**

**Não precisa adicionar manualmente!** ✅

### 2. **No Portal (Verificação de Acesso)**

Quando usuário clica em "Acessar":
1. Sistema usa o `product.id` (UUID da Supabase)
2. Verifica acesso usando esse ID
3. Se tem acesso, abre `product.vercel_deployment_url`

### 3. **Nos Apps Web (Opcional)**

Se quisesse verificar acesso nos apps:
- **Opção A:** Usar variável de ambiente `VITE_PRODUCT_ID` (UUID do produto)
- **Opção B:** Passar `productId` na URL quando abre o app (mais automático)

---

## 💡 Solução Sugerida: Passar Product ID na URL

**Em vez de configurar variável de ambiente, passar automaticamente na URL!**

### Como Funciona

1. **No Portal (ao abrir app):**
   ```javascript
   // Usa o product.id (UUID da Supabase) que já existe
   const url = `${product.vercel_deployment_url}?productId=${product.id}`;
   window.open(url, '_blank');
   ```

2. **No App (ler da URL):**
   ```javascript
   // Lê automaticamente da URL
   const urlParams = new URLSearchParams(window.location.search);
   const productId = urlParams.get('productId'); // UUID do produto
   ```

**Vantagens:**
- ✅ Automático (não precisa configurar)
- ✅ Não precisa variável de ambiente
- ✅ Funciona imediatamente
- ✅ Product ID já existe (UUID gerado pelo Supabase)

---

## 🎯 Resumo

| Item | Valor | Onde Está |
|------|-------|-----------|
| **Product ID** | UUID da Supabase | Campo `id` da tabela `registered_apps` |
| **URL Vercel** | URL do app | Campo `vercel_deployment_url` |
| **Gerado** | Automaticamente | Supabase gera UUID ao criar produto |
| **Precisa adicionar?** | Não | Já existe quando produto é cadastrado |

---

## ✅ Conclusão

**Product ID = UUID da Supabase (já existe, não precisa adicionar)**

**Solução:** Passar Product ID na URL quando abre o app (mais automático)

**Não precisa:** Adicionar campo no admin, já está tudo configurado! ✅

