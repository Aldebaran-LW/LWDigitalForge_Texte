# 🔧 Como Corrigir: Status Code no n8n

## ⚠️ Problema

O campo `{{ $json.statusCode }}` **não existe** quando a resposta está vazia (204).

---

## ✅ Solução: Verificar Ausência de Erro

Como a resposta está vazia mas o workflow continua (sem erro HTTP), isso significa **sucesso**!

### **Passo a Passo:**

1. **Abra o node "Verificar Sucesso"**

2. **Remova TODAS as condições atuais** (as que verificam `statusCode`)

3. **Adicione UMA nova condição:**
   - **Left Value:** `={{ $json.error }}`
   - **Operator:** `is empty` (ou `isEmpty`)
   - **Right Value:** (deixe vazio)

4. **Salve e teste**

---

## 🎯 Por Que Funciona?

- ✅ Se não há erro = requisição foi bem-sucedida
- ✅ Funciona para 200, 204, ou qualquer status de sucesso
- ✅ Mais simples e robusto!
- ✅ Não depende do campo `statusCode` que pode não existir

---

## 📊 Alternativa: Verificar Múltiplos Campos

Se quiser manter a verificação de status code, tente:

### **Opção 1: Verificar `status` também**
- Condição 1: `={{ $json.statusCode }}` equals `200`
- Condição 2: `={{ $json.statusCode }}` equals `204`
- Condição 3: `={{ $json.status }}` equals `200`
- Condição 4: `={{ $json.status }}` equals `204`
- **Combinator:** `OR`

### **Opção 2: Usar Expressão com Fallback**
- Left Value: `={{ $json.statusCode || $json.status || 200 }}`
- Operator: `equals`
- Right Value: `200`

### **Opção 3: Verificar se Resposta Existe**
- Left Value: `={{ $json }}`
- Operator: `exists`
- Right Value: (deixe vazio)

---

## 🧪 Como Descobrir o Campo Correto

1. **Adicione um node "Set" entre "Atualizar Todos Usuários" e "Verificar Sucesso"**

2. **Configure para mostrar todos os campos:**
   - Campo: `debug` = `={{ JSON.stringify($json) }}`
   - Campo: `statusCode` = `={{ $json.statusCode }}`
   - Campo: `status` = `={{ $json.status }}`

3. **Execute e veja qual campo tem o valor correto**

---

## 📁 Arquivos Disponíveis

- **`n8n-workflow-liberacao-simples.json`** - Versão original (verifica statusCode)
- **`n8n-workflow-liberacao-verificar-erro.json`** - Versão alternativa (verifica ausência de erro) ⭐ **RECOMENDADA**

---

**Use a versão que verifica ausência de erro - é mais robusta!** ✅
