# 🚀 Deploy da Edge Function check-subscription

## ⚠️ Problema: Supabase CLI não está instalado

O comando `supabase functions deploy check-subscription` falhou porque o Supabase CLI não está instalado ou não está no PATH do Windows.

---

## ✅ Solução 1: Instalar Supabase CLI (Recomendado)

### Windows (PowerShell):

1. **Instalar via npm (se tiver Node.js instalado):**
   ```powershell
   npm install -g supabase
   ```

2. **Ou instalar via Scoop (se tiver Scoop):**
   ```powershell
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

3. **Verificar instalação:**
   ```powershell
   supabase --version
   ```

4. **Fazer login no Supabase:**
   ```powershell
   supabase login
   ```

5. **Linkar projeto (se necessário):**
   ```powershell
   supabase link --project-ref seu-project-ref
   ```

6. **Deploy da função:**
   ```powershell
   supabase functions deploy check-subscription
   ```

---

## ✅ Solução 2: Deploy Manual pelo Dashboard (Mais Rápido)

Se você não quiser instalar o CLI agora, pode fazer o deploy manualmente pelo Dashboard do Supabase:

### Passo a Passo:

1. **Acesse:** https://supabase.com/dashboard

2. **Selecione seu projeto**

3. **Functions** → **check-subscription**

4. **Editar função** (ou criar se não existir)

5. **Copiar o código** do arquivo `supabase/functions/check-subscription/index.ts`

6. **Colar no editor** do Dashboard

7. **Salvar** (o deploy é automático quando você salva)

---

## 📋 Código da Função (Para Copiar)

O código completo está em: `supabase/functions/check-subscription/index.ts`

**Principais mudanças aplicadas:**
- ✅ Logs de debug adicionados:
  - `console.log("🔍 [Edge Function] DADOS RECEBIDOS NA FUNÇÃO:", ...)`
  - `console.log("🔍 [Edge Function] targetAppId extraído:", ...)`

---

## 🔍 Verificar Logs Após Deploy

1. **Acesse:** https://supabase.com/dashboard
2. **Functions** → **check-subscription**
3. **Logs**
4. Procure por: `🔍 [Edge Function] DADOS RECEBIDOS NA FUNÇÃO`
5. Verifique se `appId` ou `productId` estão chegando corretamente

---

## ✅ Checklist de Deploy

- [ ] Supabase CLI instalado OU deploy manual realizado
- [ ] Função `check-subscription` deployada
- [ ] Logs aparecem no Dashboard do Supabase
- [ ] Teste realizado (fazer uma requisição para a função)
- [ ] Logs mostram dados recebidos corretamente

---

## 📝 Nota Importante

Se você optar por instalar o Supabase CLI:

1. **Certifique-se de ter Node.js instalado** (versão 18 ou superior)
2. **Após instalar, reinicie o terminal/PowerShell**
3. **Faça login:** `supabase login`
4. **Linke o projeto** (se necessário)
5. **Deploy:** `supabase functions deploy check-subscription`

---

**Escolha a solução mais conveniente para você!** ✅
