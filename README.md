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

- **Banco de Dados e Backend:**
  - Um **único banco de dados Supabase** serve como a fonte central da verdade para todo o ecossistema.
  - O Supabase gerencia a autenticação de usuários, os dados de produtos, as informações de vendas e os registros de acesso dos clientes a cada aplicação comprada.
