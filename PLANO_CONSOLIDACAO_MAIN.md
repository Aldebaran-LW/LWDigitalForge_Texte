# 🎯 Plano de Consolidação - Branch Main

## 📊 Análise dos Branches

### Branches Identificados:
1. **main** (atual) - Branch principal com integração Supabase
2. **feat/supabase-registered-apps-integration** - Já mergeado no main (commit bd3633b)
3. **feat/centralize-assets-config** - Centralização de assets do Supabase Storage + limpeza de docs
4. **feat/centralize-assets-only** - Similar ao anterior
5. **Firebase_Studio_Atualização** - Relacionado ao Firebase (obsoleto, Firebase foi removido)
6. **backup/feat-supabase-integration-20251202-220746** - Backup (pode ser deletado)
7. **origin/cursor/new-autonomous-code-analysis-6f18** - Análise de código (pode ser deletado)
8. **origin/refactor-remove-hardcoded-products-and-unify-cart** - Refatoração (verificar se útil)

## 🔍 Funcionalidades Importantes por Branch

### feat/centralize-assets-config
- ✅ **Centralização de assets** - URLs do Supabase Storage em `src/config/assets.js`
- ✅ **Limpeza massiva de documentação** - Removeu ~11.000 linhas de docs obsoletos
- ✅ **Melhorias no código** - Refatorações em vários componentes
- ✅ **Testes do Supabase** - Arquivo `test-supabase.js` completo
- ✅ **Configuração do Vite** - Melhorias no `vite.config.js`

### main (atual)
- ✅ Integração Supabase completa
- ✅ Edge Functions deployadas
- ✅ Remoção do Firebase
- ✅ Google OAuth configurado
- ⚠️ Muitas mudanças não commitadas (em stash)
- ⚠️ Documentação duplicada/obsoleta ainda presente

## 🎯 Estratégia de Consolidação

### Fase 1: Preparação ✅
- [x] Salvar mudanças não commitadas em stash
- [x] Analisar diferenças entre branches

### Fase 2: Merge Seletivo
- [ ] Mesclar melhorias do `feat/centralize-assets-config`:
  - [ ] Atualizar `src/config/assets.js` com URLs do Supabase Storage
  - [ ] Aplicar limpeza de documentação obsoleta
  - [ ] Mesclar melhorias de código
  - [ ] Adicionar `test-supabase.js` se útil
  - [ ] Verificar melhorias no `vite.config.js`

### Fase 3: Limpeza
- [ ] Remover documentação obsoleta:
  - [ ] Arquivos sobre Firebase (já removido)
  - [ ] Guias duplicados
  - [ ] Documentação de merge antiga
- [ ] Manter apenas documentação essencial:
  - [ ] `GUIA_VERIFICACAO_SUPABASE.md` ✅
  - [ ] `README.md` (se existir)
  - [ ] Documentação de configuração atual

### Fase 4: Consolidação Final
- [ ] Restaurar mudanças do stash (se necessário)
- [ ] Testar aplicação
- [ ] Commit final consolidado
- [ ] Push para origin/main

### Fase 5: Limpeza de Branches
- [ ] Deletar branches locais obsoletos:
  - [ ] `Firebase_Studio_Atualização`
  - [ ] `Firebase_Studio_AtualizaÃ§Ã£o` (duplicado)
  - [ ] `backup/feat-supabase-integration-20251202-220746`
  - [ ] `feat/centralize-assets-only` (se igual ao config)
  - [ ] `feat/centralize-assets-config` (após merge)
  - [ ] `feat/supabase-registered-apps-integration` (já mergeado)
- [ ] Verificar branches remotos antes de deletar

## ⚠️ Pontos de Atenção

1. **Conflitos potenciais**: O `feat/centralize-assets-config` removeu muita documentação que pode estar sendo usada
2. **Assets**: Verificar se a mudança de assets locais para Supabase Storage não quebra nada
3. **Testes**: Garantir que tudo funciona após o merge
4. **Edge Functions**: Verificar se não foram removidas acidentalmente

## 📝 Próximos Passos Imediatos

1. Verificar se `feat/centralize-assets-config` tem algo útil que não está no main
2. Fazer merge seletivo das melhorias
3. Limpar documentação obsoleta
4. Testar aplicação
5. Commit e push
6. Deletar branches obsoletos


