# 🔧 Solução: Status Code no n8n

## ⚠️ Problema

O campo `{{ $json.statusCode }}` pode não existir quando a resposta está vazia (204).

---

## 🔍 Como o n8n Retorna Status Code

No n8n, o HTTP Request node retorna o status code em diferentes lugares dependendo da versão:

### **Opção 1: `$json.statusCode`**
```json
{
  "statusCode": 204
}
```

### **Opção 2: `$json.status`**
```json
{
  "status": 204
}
```

### **Opção 3: Metadados do Node**
O status code pode estar nos metadados do node, não no JSON:
- `{{ $json }}` pode estar vazio `{}`
- Mas o status code está em `{{ $response.statusCode }}` ou similar

---

## ✅ Soluções

### **Solução 1: Verificar Múltiplos Campos**

**No node "Verificar Sucesso", adicione condições:**

1. **Condição 1:**
   - Left Value: `={{ $json.statusCode }}`
   - Operator: `equals`
   - Right Value: `200`

2. **Condição 2:**
   - Left Value: `={{ $json.statusCode }}`
   - Operator: `equals`
   - Right Value: `204`

3. **Condição 3:**
   - Left Value: `={{ $json.status }}`
   - Operator: `equals`
   - Right Value: `200`

4. **Condição 4:**
   - Left Value: `={{ $json.status }}`
   - Operator: `equals`
   - Right Value: `204`

**Combinator:** `OR` (qualquer uma verdadeira = sucesso)

---

### **Solução 2: Verificar Ausência de Erro** (RECOMENDADA)

Como 204 = resposta vazia mas sem erro, verifique se não há erro:

**Condição única:**
- Left Value: `={{ $json.error }}`
- Operator: `is empty` (ou `does not exist`)
- Right Value: (deixe vazio)

**Lógica:** Se não há erro = sucesso! ✅

---

### **Solução 3: Usar Expressão com Fallback**

**Condição:**
- Left Value: `={{ $json.statusCode || $json.status || 200 }}`
- Operator: `equals`
- Right Value: `200`

**OU**

- Left Value: `={{ $json.statusCode || $json.status }}`
- Operator: `is in`
- Right Value: `[200, 204]`

---

### **Solução 4: Verificar se Resposta Existe**

**Condição:**
- Left Value: `={{ $json }}`
- Operator: `exists`
- Right Value: (deixe vazio)

**Lógica:** Se a resposta existe (mesmo vazia) = sucesso! ✅

---

## 🧪 Como Testar Qual Campo Existe

1. Adicione um node **"Set"** entre "Atualizar Todos Usuários" e "Verificar Sucesso"
2. Configure para mostrar todos os campos:
   - Campo: `debug` = `={{ JSON.stringify($json) }}`
   - Campo: `statusCode` = `={{ $json.statusCode }}`
   - Campo: `status` = `={{ $json.status }}`
3. Execute e veja qual campo tem o valor correto

---

## ✅ Solução Mais Simples (Recomendada)

**Mude a verificação para verificar AUSÊNCIA DE ERRO:**

1. No node "Verificar Sucesso"
2. Remova todas as condições atuais
3. Adicione UMA condição:
   - **Left Value:** `={{ $json.error }}`
   - **Operator:** `is empty`
   - **Right Value:** (deixe vazio)
4. Salve e teste

**Por quê?**
- Se não há erro = requisição foi bem-sucedida
- Funciona para 200, 204, ou qualquer status de sucesso
- Mais simples e robusto! ✅

---

## 📊 Verificar OUTPUT Real

**No node "Atualizar Todos Usuários":**

1. Clique na aba **"JSON"** no OUTPUT
2. Veja a estrutura completa
3. Procure por:
   - `statusCode`
   - `status`
   - `error`
   - Qualquer outro campo relacionado

**Anote qual campo contém o status code!** 🔍
