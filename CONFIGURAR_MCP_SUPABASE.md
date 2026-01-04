# Configuração do MCP (Model Context Protocol) para Supabase

Este documento descreve como configurar o servidor MCP do Supabase no Cursor IDE.

## O que é MCP?

O Model Context Protocol (MCP) permite que o Cursor IDE se conecte diretamente ao seu projeto Supabase, permitindo que a IA acesse e gerencie seu banco de dados, migrations, e outras funcionalidades do Supabase.

## Configuração

### 1. Localização do Arquivo de Configuração

A configuração do MCP deve ser adicionada ao arquivo de configuração do Cursor. Normalmente, este arquivo está localizado em:

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

**macOS:**
```
~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**Linux:**
```
~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

### 2. Configuração JSON

Adicione a seguinte configuração ao arquivo de configuração do MCP:

```json
{
  "mcpServers": {
    "supabase": {
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "--project-ref=wwwwyuwighdehmvnolrl"
      ],
      "command": "npx",
      "env": {
        "SUPABASE_ACCESS_TOKEN": "seu_supabase_access_token_aqui"
      }
    }
  }
}
```

### 3. Detalhes da Configuração

- **project-ref**: O ID do seu projeto Supabase (`wwwwyuwighdehmvnolrl`)
- **SUPABASE_ACCESS_TOKEN**: Token de acesso do Supabase para autenticação

### 4. Obter o SUPABASE_ACCESS_TOKEN

1. Acesse o [Painel do Supabase](https://supabase.com/dashboard)
2. Vá em **Settings** > **Access Tokens**
3. Crie um novo token ou use um existente
4. Copie o token e adicione na configuração acima

### 5. Reiniciar o Cursor

Após adicionar a configuração, reinicie o Cursor IDE para que as mudanças tenham efeito.

## Funcionalidades Disponíveis

Com o MCP do Supabase configurado, você poderá:

- ✅ Listar tabelas do banco de dados
- ✅ Executar queries SQL
- ✅ Aplicar migrations
- ✅ Gerenciar Edge Functions
- ✅ Ver logs do projeto
- ✅ Obter advisors de segurança e performance
- ✅ Gerar tipos TypeScript do banco de dados

## Segurança

⚠️ **IMPORTANTE**: O token `SUPABASE_ACCESS_TOKEN` é sensível. Certifique-se de:

- Não commitar este token no Git
- Não compartilhar este token publicamente
- Usar tokens com permissões mínimas necessárias
- Rotacionar tokens regularmente

## Referências

- [Documentação do MCP Supabase](https://github.com/supabase/mcp-server-supabase)
- [Documentação do Supabase](https://supabase.com/docs)







