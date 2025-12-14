# 📸 Documentação: Armazenamento de Imagens

## 🗄️ Onde as Imagens são Salvas

As imagens dos produtos são armazenadas no **Supabase Storage**, no bucket público chamado `assets-publicos`.

### Estrutura do Banco de Dados

**Tabela:** `registered_apps`
- **Campo:** `image_url` (TEXT, nullable)
- **Formato:** URL completa para o arquivo no Supabase Storage

### Bucket no Supabase Storage

- **Nome do Bucket:** `assets-publicos`
- **Tipo:** Público (`public: true`)
- **Localização:** Supabase Storage → Buckets → `assets-publicos`

### Arquivos Atualmente no Bucket

1. `Capa.jpg`
2. `JornadaPro-Capa.png`
3. `Logo.png`

## 📝 Formato das URLs

O formato padrão da URL do Supabase Storage é:

```
https://[PROJECT_REF].supabase.co/storage/v1/object/public/[BUCKET_NAME]/[FILE_NAME]
```

### Exemplo Real

```
https://wwwwyuwighdehmvnolrl.supabase.co/storage/v1/object/public/assets-publicos/JornadaPro-Capa.png
```

**Onde:**
- `wwwwyuwighdehmvnolrl` = Project Reference ID do Supabase
- `assets-publicos` = Nome do bucket
- `JornadaPro-Capa.png` = Nome do arquivo

## 🔍 Como Verificar/Corrigir URLs

### 1. Verificar URLs Atuais no Banco

```sql
SELECT id, name, image_url 
FROM registered_apps 
WHERE image_url IS NOT NULL;
```

### 2. Gerar URL Correta

Para gerar uma URL correta, você precisa:

1. **Project Reference ID**: Encontre no Supabase Dashboard → Settings → API
   - Atual: `wwwwyuwighdehmvnolrl`

2. **Bucket Name**: `assets-publicos`

3. **File Name**: Nome do arquivo no bucket (ex: `JornadaPro-Capa.png`)

**URL Final:**
```
https://wwwwyuwighdehmvnolrl.supabase.co/storage/v1/object/public/assets-publicos/[NOME_DO_ARQUIVO]
```

### 3. Upload de Novas Imagens

Para adicionar uma nova imagem:

1. **Via Supabase Dashboard:**
   - Vá para: Storage → Buckets → `assets-publicos`
   - Clique em "Upload file"
   - Selecione a imagem
   - Copie a URL pública gerada

2. **Via Código (Admin):**
   - O formulário de admin (`AdminFormularioProduto.jsx`) tem um campo `image_url`
   - Cole a URL completa gerada pelo Supabase Storage

3. **Via API (se necessário):**
   ```javascript
   // Exemplo de upload usando Supabase Storage
   const { data, error } = await supabase.storage
     .from('assets-publicos')
     .upload('nome-do-arquivo.png', file)
   
   if (!error) {
     const { data: { publicUrl } } = supabase.storage
       .from('assets-publicos')
       .getPublicUrl('nome-do-arquivo.png')
     // Use publicUrl no campo image_url
   }
   ```

## 🐛 Troubleshooting

### Problema: Imagens não aparecem

**Possíveis causas:**

1. **URL incorreta no banco**
   - Verifique se a URL está completa
   - Confirme que o Project Reference ID está correto
   - Verifique se o nome do arquivo está correto (case-sensitive)

2. **Bucket não está público**
   - Verifique: Storage → Buckets → `assets-publicos` → Settings
   - Certifique-se de que "Public bucket" está ativado

3. **Arquivo não existe no bucket**
   - Verifique: Storage → Buckets → `assets-publicos` → Files
   - Confirme que o arquivo está lá

4. **Nome do arquivo incorreto**
   - Os nomes são case-sensitive
   - Verifique espaços e caracteres especiais

### Como Verificar se a URL está Funcionando

Abra a URL diretamente no navegador:
```
https://wwwwyuwighdehmvnolrl.supabase.co/storage/v1/object/public/assets-publicos/JornadaPro-Capa.png
```

Se a imagem aparecer, a URL está correta. Se não, verifique os itens acima.

## 📋 Checklist para Adicionar Nova Imagem

- [ ] Upload da imagem no bucket `assets-publicos`
- [ ] Copiar a URL pública gerada
- [ ] Verificar que a URL está completa (começa com `https://`)
- [ ] Testar a URL no navegador
- [ ] Salvar a URL no campo `image_url` da tabela `registered_apps`
- [ ] Verificar se a imagem aparece na interface

## 🔗 Código que Usa as Imagens

As imagens são usadas em:

1. **`src/components/ProductCard.jsx`** - Cards de produtos na listagem
2. **`src/components/ProductsSection.jsx`** - Seção de produtos na home
3. **`src/pages/ProductDetailPage.jsx`** - Página de detalhes do produto
4. **`src/pages/portal/PortalMeusProdutos.jsx`** - Portal do usuário
5. **`src/components/ShoppingCart.jsx`** - Carrinho de compras

Todos usam: `product.image_url` diretamente do banco de dados.

## 📌 Notas Importantes

- ✅ O bucket `assets-publicos` está configurado como público
- ✅ As URLs são geradas automaticamente pelo Supabase quando você faz upload
- ✅ Não é necessário modificar o código para usar as imagens
- ⚠️ Certifique-se de usar a URL completa (não apenas o nome do arquivo)
- ⚠️ Os nomes de arquivos são case-sensitive

## 🔄 Atualizar URL no Banco

Se precisar atualizar uma URL no banco:

```sql
UPDATE registered_apps 
SET image_url = 'https://wwwwyuwighdehmvnolrl.supabase.co/storage/v1/object/public/assets-publicos/NOVO_ARQUIVO.png'
WHERE id = 'ID_DO_PRODUTO';
```

Ou via interface admin: `/admin/produtos` → Editar produto → Campo "URL da Imagem"
