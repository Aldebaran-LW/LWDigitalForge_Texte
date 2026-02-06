# ⚡ Início Rápido - Implementação

**Tempo estimado:** 15-30 minutos por aplicação

---

## 🎯 Para LW StockForge

### 1. Copiar Arquivo
```bash
# No repositório StockForge
# Copiar conteúdo de: APLICACOES/STOCKFORGE-usePortalAuth.js
# Para: src/hooks/usePortalAuth.js
```

### 2. Adicionar no App.jsx
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

  // Resto do código permanece igual
}
```

### 3. Testar
- [ ] Login normal funciona
- [ ] Acesso via portal funciona

**Pronto!** ✅

---

## 🎯 Para Ponto Diário (JornadaPro)

### 1. Copiar Arquivo
```bash
# No repositório Ponto Diário
# Copiar conteúdo de: APLICACOES/PONTO_DIARIO-usePortalAuth.js
# Para: src/hooks/usePortalAuth.js
```

### 2. Adicionar no App.jsx
Mesmo processo do StockForge.

### 3. Testar
- [ ] Login normal funciona
- [ ] Acesso via portal funciona

**Pronto!** ✅

---

## 📚 Documentação Completa

- **Guia Completo:** `README-INTEGRACAO-PORTAL.md`
- **Passo a Passo:** `IMPLEMENTACAO-PASSO-A-PASSO.md`
- **Checklist:** `CHECKLIST-IMPLEMENTACAO.md`

---

**Última atualização:** 25 de Janeiro de 2026
