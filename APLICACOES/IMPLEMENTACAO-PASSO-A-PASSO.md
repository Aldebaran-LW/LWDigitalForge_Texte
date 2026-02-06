# 🚀 Implementação Passo a Passo - Integração com Portal

**Data:** 25 de Janeiro de 2026  
**Aplicações:** LW StockForge e Ponto Diário (JornadaPro)

---

## 📋 Pré-requisitos

- [ ] Acesso ao repositório da aplicação
- [ ] Aplicação rodando localmente (para testar)
- [ ] Conhecimento básico de React
- [ ] Editor de código

---

## 🔧 Implementação no LW StockForge

### Passo 1: Preparar Arquivo do Hook

1. Abrir repositório: https://github.com/Aldebaran-LW/LW_StockForge
2. Criar pasta `src/hooks/` (se não existir)
3. Copiar conteúdo do arquivo `APLICACOES/STOCKFORGE-usePortalAuth.js`
4. Colar em `src/hooks/usePortalAuth.js`
5. **Verificar e ajustar** o caminho do import do Supabase:
   ```javascript
   import { supabase } from '@/lib/supabaseClient'; // Ajustar se necessário
   ```

### Passo 2: Adicionar no App Principal

1. Localizar arquivo principal (geralmente `src/App.jsx` ou `src/main.jsx`)
2. **Fazer backup** do arquivo (commit antes de modificar)
3. Adicionar import no topo:
   ```javascript
   import { usePortalAuth } from '@/hooks/usePortalAuth';
   import { Loader2 } from 'lucide-react'; // ou outro componente de loading
   ```
4. Adicionar hook no componente:
   ```javascript
   function App() {
     // ADICIONAR ESTAS LINHAS:
     const { isChecking } = usePortalAuth();
     
     // ADICIONAR LOADING:
     if (isChecking) {
       return (
         <div className="flex items-center justify-center h-screen">
           <Loader2 className="h-8 w-8 animate-spin" />
           <span className="ml-2">Carregando...</span>
         </div>
       );
     }
     
     // TODO O RESTO DO CÓDIGO PERMANECE IGUAL
     return (
       // Seu código atual
     );
   }
   ```

### Passo 3: Testar Localmente

1. Rodar aplicação: `npm run dev` ou `npm start`
2. **Teste 1:** Acessar aplicação diretamente
   - Deve funcionar normalmente (login normal)
3. **Teste 2:** Acessar via portal
   - Fazer login no portal
   - Clicar em "Acessar Aplicação" no StockForge
   - Deve autenticar automaticamente

### Passo 4: Commit e Deploy

1. Fazer commit:
   ```bash
   git add src/hooks/usePortalAuth.js
   git add src/App.jsx  # ou arquivo modificado
   git commit -m "feat: adiciona integração com portal para acesso automático"
   ```
2. Fazer push
3. Deploy (se automático) ou fazer deploy manual

---

## 🔧 Implementação no Ponto Diário (JornadaPro)

### Passo 1: Preparar Arquivo do Hook

1. Abrir repositório: https://github.com/Aldebaran-LW/Ponto_Diario-1
2. Criar pasta `src/hooks/` (se não existir)
3. Copiar conteúdo do arquivo `APLICACOES/PONTO_DIARIO-usePortalAuth.js`
4. Colar em `src/hooks/usePortalAuth.js`
5. **Verificar e ajustar** o caminho do import do Supabase

### Passo 2: Adicionar no App Principal

Mesmo processo do StockForge, mas usando o hook do Ponto Diário.

### Passo 3: Testar Localmente

Mesmo processo do StockForge.

### Passo 4: Commit e Deploy

Mesmo processo do StockForge.

---

## ✅ Checklist de Validação

### Antes de Fazer Commit

- [ ] Código compila sem erros
- [ ] Login normal funciona (testar localmente)
- [ ] Não há warnings críticos no console
- [ ] Hook está configurado corretamente (Product ID e rota)

### Após Deploy

- [ ] Login normal funciona em produção
- [ ] Acesso via portal funciona em produção
- [ ] Hash inválido não quebra a aplicação
- [ ] Sem hash funciona normalmente

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@/hooks/usePortalAuth'"
**Solução:** Verificar se o arquivo foi criado no caminho correto: `src/hooks/usePortalAuth.js`

### Erro: "Cannot find module '@/lib/supabaseClient'"
**Solução:** Ajustar o caminho do import conforme a estrutura da aplicação

### Hook não funciona, mas login normal funciona
**Solução:** Não é crítico. O hook é opcional. Verificar:
- Product ID está correto?
- Hash está sendo passado pelo portal?
- Console do navegador mostra erros?

### Login normal parou de funcionar
**Solução:** Reverter mudanças imediatamente. O hook não deveria afetar login normal.

---

## 📝 Exemplo de Modificação Mínima

### Antes (App.jsx original):
```javascript
function App() {
  return (
    <Router>
      <Routes>
        {/* rotas */}
      </Routes>
    </Router>
  );
}
```

### Depois (App.jsx modificado):
```javascript
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { Loader2 } from 'lucide-react';

function App() {
  const { isChecking } = usePortalAuth();
  
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* rotas - NÃO MODIFICAR */}
      </Routes>
    </Router>
  );
}
```

**Mudanças mínimas:** Apenas 3 linhas adicionadas + loading.

---

## 🎯 Resumo

1. **Copiar** hook para `src/hooks/usePortalAuth.js`
2. **Ajustar** import do Supabase (se necessário)
3. **Adicionar** 3 linhas no App principal
4. **Testar** login normal primeiro
5. **Testar** acesso via portal
6. **Commit** e deploy

**Tempo estimado:** 15-30 minutos por aplicação

---

**Documento criado em:** 25 de Janeiro de 2026
