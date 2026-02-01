# 🚀 Implementar no JornadaPro - Passo a Passo

**Repositório:** https://github.com/Aldebaran-LW/Ponto_Diario-1  
**Tempo estimado:** 10-15 minutos

---

## 📋 Passo 1: Clonar/Atualizar Repositório

```bash
# Se já tem o repositório clonado:
cd Ponto_Diario-1
git pull origin main

# Se não tem:
git clone https://github.com/Aldebaran-LW/Ponto_Diario-1
cd Ponto_Diario-1
```

---

## 📋 Passo 2: Criar Pasta e Arquivo do Hook

```bash
# Criar pasta hooks (se não existir)
mkdir -p src/hooks

# Copiar conteúdo do arquivo APLICACOES/PONTO_DIARIO-usePortalAuth.js
# Para: src/hooks/usePortalAuth.js
```

**Conteúdo do arquivo:** Ver `APLICACOES/PONTO_DIARIO-usePortalAuth.js`

---

## 📋 Passo 3: Localizar e Modificar App.jsx

1. Localizar arquivo principal (geralmente `src/App.jsx` ou `src/main.jsx`)
2. **Fazer backup** (commit antes de modificar)
3. Adicionar imports no topo:

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

---

## 📋 Passo 4: Verificar Caminho do Supabase

No arquivo `src/hooks/usePortalAuth.js`, verificar se o import está correto:

```javascript
import { supabase } from '@/lib/supabaseClient'; // Ajustar se necessário
```

**Caminhos comuns:**
- `@/lib/supabaseClient`
- `@/lib/supabase`
- `./lib/supabaseClient`
- `../lib/supabaseClient`

---

## 📋 Passo 5: Testar Localmente

```bash
npm run dev
# ou
npm start
```

**Testes:**
1. Acessar aplicação diretamente → Login normal deve funcionar
2. Acessar via portal → Deve autenticar automaticamente e ir para `/apontamentos`

---

## 📋 Passo 6: Commit e Push

```bash
git add src/hooks/usePortalAuth.js
git add src/App.jsx  # ou arquivo modificado
git commit -m "feat: adiciona integração com portal para acesso automático"
git push origin main
```

---

## ✅ Checklist Rápido

- [ ] Repositório atualizado
- [ ] Arquivo `src/hooks/usePortalAuth.js` criado
- [ ] Product ID configurado: `e8ff7872-dedb-405c-bf8a-f7901ac4b432`
- [ ] Rota padrão configurada: `/apontamentos`
- [ ] Import do Supabase ajustado
- [ ] Hook adicionado no App.jsx
- [ ] Login normal funciona (testar)
- [ ] Acesso via portal funciona (testar)
- [ ] Commit e push realizados

---

**Tempo total:** 10-15 minutos
