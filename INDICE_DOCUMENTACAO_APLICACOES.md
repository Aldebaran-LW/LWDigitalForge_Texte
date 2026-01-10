# 📚 Índice de Documentação para Aplicações

## 🎯 Documentação Principal

### Para Começar Rápido
- **[QUICK_START_APLICACOES.md](./QUICK_START_APLICACOES.md)** ⚡
  - Guia rápido de 5 minutos
  - Código mínimo necessário
  - Pontos críticos

### Guia Completo
- **[GUIA_COMPLETO_APLICACOES.md](./GUIA_COMPLETO_APLICACOES.md)** 📘
  - Documentação completa e detalhada
  - Todos os passos explicados
  - Exemplos completos
  - Checklist de implementação
  - Troubleshooting

## 🔧 Documentação Técnica

### Problemas e Soluções
- **[SOLUCAO_PROBLEMA_ACESSO_APLICACAO.md](./SOLUCAO_PROBLEMA_ACESSO_APLICACOES.md)** 🔍
  - Problema identificado: appId obrigatório
  - Correções aplicadas
  - Como usar corretamente

- **[RESUMO_CORRECOES_ACESSO.md](./RESUMO_CORRECOES_ACESSO.md)** ✅
  - Resumo das correções
  - Arquivos modificados
  - Próximos passos

### Integração
- **[INTEGRACAO_VERIFICACAO_ASSINATURA.md](./INTEGRACAO_VERIFICACAO_ASSINATURA.md)** 🔗
  - Como funciona a verificação automática
  - Fluxo de verificação
  - Tipos de acesso

- **[VERIFICACAO_NOS_APPS_WEB.md](./VERIFICACAO_NOS_APPS_WEB.md)** 🌐
  - Opções de verificação
  - Quando usar cada método
  - Exemplos de implementação

## 🛠️ Ferramentas de Diagnóstico

### Scripts SQL
- **[DIAGNOSTICO_ACESSO_USUARIO.sql](./DIAGNOSTICO_ACESSO_USUARIO.sql)** 🔍
  - Verificar acesso do usuário
  - Verificar assinaturas ativas
  - Verificar testes ativos
  - Resumo completo de acesso

## 📋 Checklist Rápido

### Antes de Começar
- [ ] Ler [QUICK_START_APLICACOES.md](./QUICK_START_APLICACOES.md)
- [ ] Configurar variáveis de ambiente
- [ ] Instalar dependências

### Durante Desenvolvimento
- [ ] Seguir [GUIA_COMPLETO_APLICACOES.md](./GUIA_COMPLETO_APLICACOES.md)
- [ ] Implementar autenticação
- [ ] Implementar verificação de acesso
- [ ] Testar com diferentes cenários

### Antes de Deploy
- [ ] Verificar checklist em [GUIA_COMPLETO_APLICACOES.md](./GUIA_COMPLETO_APLICACOES.md)
- [ ] Testar acesso negado
- [ ] Testar acesso permitido
- [ ] Configurar variáveis no deploy

### Se Tiver Problemas
- [ ] Ler [SOLUCAO_PROBLEMA_ACESSO_APLICACAO.md](./SOLUCAO_PROBLEMA_ACESSO_APLICACAO.md)
- [ ] Executar [DIAGNOSTICO_ACESSO_USUARIO.sql](./DIAGNOSTICO_ACESSO_USUARIO.sql)
- [ ] Verificar se appId está sendo passado
- [ ] Verificar logs da Edge Function

## 🎓 Ordem de Leitura Recomendada

### Para Desenvolvedores Novos
1. **[QUICK_START_APLICACOES.md](./QUICK_START_APLICACOES.md)** - Comece aqui!
2. **[GUIA_COMPLETO_APLICACOES.md](./GUIA_COMPLETO_APLICACOES.md)** - Leia completo
3. **[INTEGRACAO_VERIFICACAO_ASSINATURA.md](./INTEGRACAO_VERIFICACAO_ASSINATURA.md)** - Entenda o sistema

### Para Desenvolvedores Experientes
1. **[QUICK_START_APLICACOES.md](./QUICK_START_APLICACOES.md)** - Referência rápida
2. **[VERIFICACAO_NOS_APPS_WEB.md](./VERIFICACAO_NOS_APPS_WEB.md)** - Escolha método
3. **[GUIA_COMPLETO_APLICACOES.md](./GUIA_COMPLETO_APLICACOES.md)** - Detalhes técnicos

### Para Troubleshooting
1. **[SOLUCAO_PROBLEMA_ACESSO_APLICACAO.md](./SOLUCAO_PROBLEMA_ACESSO_APLICACAO.md)** - Problema comum
2. **[DIAGNOSTICO_ACESSO_USUARIO.sql](./DIAGNOSTICO_ACESSO_USUARIO.sql)** - Diagnosticar
3. **[RESUMO_CORRECOES_ACESSO.md](./RESUMO_CORRECOES_ACESSO.md)** - Ver correções

## 🔑 Conceitos Importantes

### appId é OBRIGATÓRIO
- ⚠️ Sem `appId`, a verificação de acesso **não funciona**
- O portal salva `app_product_id` no `sessionStorage`
- Use `VITE_PRODUCT_ID` como fallback

### Verificação em 3 Níveis
1. **Assinatura ativa** para o app específico
2. **Compra específica** do app
3. **Trial ativo** para o app

### Fluxo de Acesso
```
Usuário clica "Acessar" no Portal
    ↓
Portal salva appId no sessionStorage
    ↓
Portal abre app em nova aba
    ↓
App lê appId do sessionStorage
    ↓
App verifica acesso com appId
    ↓
App permite ou nega acesso
```

## 📞 Suporte

Se precisar de ajuda:
1. Consulte a documentação relevante
2. Execute o script de diagnóstico
3. Verifique os logs
4. Confirme que appId está correto

---

**Última atualização:** Dezembro 2024
