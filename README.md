# LW Digital Forge - Loja Principal

Este projeto é a plataforma central de e-commerce da LW Digital Forge, destinada à venda de aplicações web, como bots e automações.

## Arquitetura do Ecossistema

O ecossistema da LW Digital Forge é composto por uma arquitetura moderna e desacoplada, garantindo escalabilidade e manutenção simplificada.

- **Loja Principal (Este Repositório):**
  - Uma aplicação React (Vite) que funciona como a vitrine e o portal de vendas dos produtos.
  - Responsável pelo cadastro de produtos, gerenciamento de usuários, carrinho de compras e processamento de pagamentos.

- **Aplicações/Produtos:**
  - Cada aplicação vendida (ex: um bot de automação) reside em seu **próprio repositório no GitHub**.
  - Isso permite que cada produto seja desenvolvido, versionado e mantido de forma independente.

- **Hospedagem e Deploy:**
  - A loja principal e cada uma das aplicações são implantadas de forma independente na **Vercel**.
  - A Vercel é configurada para fazer o deploy automático a cada `push` na branch principal do respectivo repositório, garantindo integração e entrega contínua (CI/CD).
  - As chaves de API e outras variáveis de ambiente para o ambiente de produção (online) devem ser configuradas diretamente no painel de controle do projeto na Vercel.

- **Banco de Dados e Backend:**
  - Um **único banco de dados Supabase** serve como a fonte central da verdade para todo o ecossistema.
  - O Supabase gerencia a autenticação de usuários, os dados de produtos, as informações de vendas e os registros de acesso dos clientes a cada aplicação comprada.

---

## Desenvolvimento Local

Para executar este projeto em um ambiente de desenvolvimento local (na sua própria máquina), é crucial configurar as variáveis de ambiente para que a aplicação possa se conectar ao Supabase.

1.  **Crie um arquivo `.env`** na raiz do projeto.

2.  **Adicione as chaves do Supabase** a este arquivo. Use o seguinte modelo:

    ```
    VITE_SUPABASE_URL="SUA_URL_DO_SUPABASE"
    VITE_SUPABASE_ANON_KEY="SUA_CHAVE_ANON_DO_SUPABASE"
    ```

3.  **Substitua** `SUA_URL_DO_SUPABASE` e `SUA_CHAVE_ANON_DO_SUPABASE` pelas chaves encontradas no painel do seu projeto Supabase em `Settings` > `API`.

**Importante:** O arquivo `.env` é estritamente para uso local e **não deve** ser enviado para o GitHub. Ele já está incluído no arquivo `.gitignore` para prevenir que informações sensíveis sejam expostas.
