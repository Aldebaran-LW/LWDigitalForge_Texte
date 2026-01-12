# 🚀 Teste Local - Porta 3000

## 📋 Status

O servidor de desenvolvimento está sendo iniciado na porta 3000.

---

## 🔧 Comando Executado

```bash
npm run dev
```

**Configuração:**
- **Porta:** 3000
- **Host:** `::` (todas as interfaces)
- **Framework:** Vite

---

## 🌐 Acesso Local

Após o servidor iniciar, acesse:

- **URL Local:** `http://localhost:3000`
- **URL Rede:** `http://[seu-ip]:3000`

---

## ✅ Verificar se está rodando

### **1. Verificar no Navegador**

Abra o navegador e acesse: `http://localhost:3000`

### **2. Verificar no Terminal**

O terminal deve mostrar algo como:

```
  VITE v4.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://[seu-ip]:3000/
```

---

## 🧪 O que testar localmente

### **1. Página de Login**
- Acesse `/login`
- Teste login com usuário liberado
- Verifique redirecionamento após login

### **2. Painel Admin**
- Acesse `/admin/dashboard`
- Teste liberação manual de usuário
- Verifique se a compra é criada corretamente

### **3. Portal**
- Acesse `/portal/dashboard`
- Teste função RPC `get_user_apps_status`
- Verifique redirecionamento

---

## 🔍 Verificar Logs

### **Console do Navegador (F12)**

1. Abra o DevTools (F12)
2. Vá para a aba "Console"
3. Verifique se há erros
4. Verifique logs de debug

### **Terminal do Servidor**

O terminal mostra logs do servidor Vite e erros de build.

---

## ⚠️ Problemas Comuns

### **Porta 3000 já está em uso**

Se a porta 3000 já estiver em uso:

1. **Parar o processo na porta 3000:**
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID [PID] /F
   ```

2. **Ou usar outra porta:**
   ```bash
   npm run dev -- --port 3001
   ```

### **Erro de dependências**

Se houver erro de dependências:

```bash
npm install
```

### **Erro de variáveis de ambiente**

Verifique se o arquivo `.env` existe e está configurado corretamente.

---

## 🎯 Próximos Passos

1. ✅ Servidor iniciando
2. ⏭️ Aguardar servidor iniciar completamente
3. ⏭️ Acessar `http://localhost:3000` no navegador
4. ⏭️ Testar funcionalidades localmente
5. ⏭️ Verificar console para erros

---

## 📝 Notas

- O servidor Vite tem **hot-reload** (recarrega automaticamente ao salvar arquivos)
- Mantenha o terminal aberto enquanto testa
- Para parar o servidor: `Ctrl + C` no terminal
