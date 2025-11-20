# Guia de Teste da Integração com Supabase

Este documento explica como testar a integração com o Supabase no projeto.

## Executando o Teste

Para executar o teste de integração, use o comando:

```bash
npm run test:supabase
```

## O que o Teste Verifica

O script de teste verifica os seguintes aspectos da integração:

1. **Conexão com Supabase**: Verifica se é possível conectar ao projeto Supabase
2. **Sessão de Autenticação**: Verifica se há uma sessão ativa
3. **Tabelas do Banco**: Verifica se as tabelas principais existem e são acessíveis:
   - `profiles` - Perfis de usuários
   - `products` - Produtos do e-commerce
   - `product_types` - Tipos de produtos
4. **Funções de Autenticação**: Verifica se os métodos de autenticação estão disponíveis
5. **Realtime**: Verifica se a funcionalidade de tempo real está configurada

## Interpretando os Resultados

### ✓ Teste Passou
- A funcionalidade está funcionando corretamente

### ⚠ Aviso
- A funcionalidade existe, mas pode requerer configuração adicional ou autenticação

### ✗ Teste Falhou
- Há um problema que precisa ser corrigido

## Problemas Comuns

### Chave da API Inválida

Se você receber o erro "Invalid API key", siga estes passos:

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie a **anon/public** key
5. Atualize o arquivo `src/lib/customSupabaseClient.js` com a nova chave

Ou use variáveis de ambiente:

```bash
SUPABASE_URL=https://seu-projeto.supabase.co SUPABASE_ANON_KEY=sua-chave npm run test:supabase
```

### Tabelas Não Encontradas

Se as tabelas não forem encontradas:

1. Verifique se as migrações foram executadas
2. Verifique se você está conectado ao projeto correto
3. Verifique as permissões RLS (Row Level Security) no Supabase

### Erro de Permissão

Se você receber erros de permissão:

- Isso é normal se você não estiver autenticado
- As tabelas podem ter RLS (Row Level Security) habilitado
- Para testar com autenticação, você precisará fazer login primeiro

## Testando com Autenticação

Para testar funcionalidades que requerem autenticação, você pode:

1. Fazer login na aplicação primeiro
2. Ou criar um script de teste que autentica antes de executar os testes

## Estrutura do Projeto Supabase

O projeto usa as seguintes tabelas:

- **profiles**: Armazena informações de perfil dos usuários
- **products**: Armazena produtos do e-commerce
- **product_types**: Armazena tipos/categorias de produtos

## Suporte

Se você encontrar problemas:

1. Verifique os logs do teste para mais detalhes
2. Verifique a documentação do Supabase: https://supabase.com/docs
3. Verifique as configurações do projeto no dashboard do Supabase

