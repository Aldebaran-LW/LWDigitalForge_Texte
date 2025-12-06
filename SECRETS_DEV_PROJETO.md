# 🔐 Secrets para Projeto de Desenvolvimento

## 📋 Credenciais do Projeto `LW_Digital_Forge_Dev`

### **Informações do Projeto:**
- **Project Name:** `LW_Digital_Forge_Dev`
- **Project ID:** `vedrmtowoosqxzqxgxpb`
- **Project URL:** `https://vedrmtowoosqxzqxgxpb.supabase.co`

### **Chaves Fornecidas:**
1. **Publishable Key (anon key):** `sb_publishable_zrsVa51dgFxtA1blGcpbOg_tB8WyAlq`
2. **Secret Key (service_role):** `sb_secret_af6L1ZMdP2s5ftIyUwF7dA_ycFz_b9X`

---

## 🔑 Secrets para Adicionar no GitHub

Acesse: https://github.com/Aldebaran-LW/LWDigitalForge_Texte/settings/secrets/actions

### **Secret 1: Project ID de Desenvolvimento**
- **Name:** `SUPABASE_PROJECT_ID_DEV`
- **Value:** `vedrmtowoosqxzqxgxpb`

### **Secret 2: URL de Desenvolvimento**
- **Name:** `VITE_SUPABASE_URL_DEV`
- **Value:** `https://vedrmtowoosqxzqxgxpb.supabase.co`

### **Secret 3: Anon Key de Desenvolvimento (Frontend)**
- **Name:** `VITE_SUPABASE_ANON_KEY_DEV`
- **Value:** `sb_publishable_zrsVa51dgFxtA1blGcpbOg_tB8WyAlq`

### **Secret 4: Service Role Key (Backend/CLI) - Opcional**
- **Name:** `SUPABASE_SERVICE_ROLE_KEY_DEV`
- **Value:** `sb_secret_af6L1ZMdP2s5ftIyUwF7dA_ycFz_b9X`
- **⚠️ ATENÇÃO:** Esta chave tem acesso total ao banco. Use apenas se necessário!

---

## ✅ Checklist

- [ ] `SUPABASE_PROJECT_ID_DEV` = `vedrmtowoosqxzqxgxpb`
- [ ] `VITE_SUPABASE_URL_DEV` = `https://vedrmtowoosqxzqxgxpb.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY_DEV` = `sb_publishable_zrsVa51dgFxtA1blGcpbOg_tB8WyAlq`
- [ ] `SUPABASE_SERVICE_ROLE_KEY_DEV` = `sb_secret_af6L1ZMdP2s5ftIyUwF7dA_ycFz_b9X` (opcional)

---

## 📝 Próximos Passos

1. ✅ Adicionar os secrets acima no GitHub
2. ✅ Aplicar migrations no projeto de desenvolvimento
3. ✅ Testar o deploy

---

## 🆘 Importante

- ⚠️ **Nunca commite essas chaves no Git!**
- ⚠️ A `service_role` key tem acesso total - mantenha segura!
- ✅ A `publishable` key é segura para uso no frontend
