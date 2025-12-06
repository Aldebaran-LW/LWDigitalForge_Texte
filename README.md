# 🚀 LWDigitalForge - Plataforma de Automação Inteligente

<div align="center">

![LWDigitalForge Logo](public/Logo.png)

**Transforme sua produtividade com bots Telegram e planilhas Excel inteligentes**

[![Deploy Status](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.30-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

**LWDigitalForge** é uma plataforma de e-commerce especializada em soluções de automação, oferecendo:

- 🤖 **Bots Telegram** personalizados para automação de tarefas
- 📊 **Planilhas Excel** inteligentes para gestão e análise
- 💼 **Portal do Cliente** com gerenciamento de produtos e pagamentos
- 🔐 **Autenticação segura** com Supabase (email/senha e OAuth Google)
- 🌙 **Dark Mode** nativo
- 🛒 **Sistema de carrinho** integrado

---

## ✨ Funcionalidades

### 🌐 **Área Pública**
- ✅ Landing page moderna e responsiva
- ✅ Catálogo de produtos com busca e filtros
- ✅ Páginas de detalhes de produtos
- ✅ Carrinho de compras
- ✅ Formulário de contato/orçamento
- ✅ Modo claro/escuro

### 🔐 **Autenticação**
- ✅ Cadastro de usuários (email/senha)
- ✅ Login com Google OAuth
- ✅ Recuperação de senha
- ✅ Perfis de usuário

### 👤 **Portal do Cliente**
- ✅ Visualização de produtos adquiridos
- ✅ Histórico de pagamentos
- ✅ Download de recursos
- ✅ Área de testes

### 🛠️ **Painel Administrativo**
- ✅ Dashboard com métricas
- ✅ Gerenciamento de produtos
- ✅ Gerenciamento de usuários
- ✅ Controle de vendas
- ✅ Tipos de produtos

---

## 🛠️ Tecnologias

### **Frontend**
- [React 18.2](https://reactjs.org/) - Biblioteca JavaScript para UI
- [Vite 4.5](https://vitejs.dev/) - Build tool rápido
- [React Router 6.16](https://reactrouter.com/) - Roteamento
- [Tailwind CSS 3.3](https://tailwindcss.com/) - Framework CSS utility-first
- [Framer Motion 10.16](https://www.framer.com/motion/) - Animações
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis

### **Backend & Infraestrutura**
- [Supabase](https://supabase.com/) - Backend as a Service
  - PostgreSQL Database
  - Authentication (email, OAuth Google)
  - Storage para arquivos
  - Edge Functions
- [Vercel](https://vercel.com/) - Hospedagem e deploy

### **Integrações**
- [Hostinger Ecommerce API](https://www.hostinger.com/) - Gerenciamento de produtos
- [Mercado Pago](https://www.mercadopago.com.br/) - Pagamentos

### **Outras Ferramentas**
- [Lucide React](https://lucide.dev/) - Ícones
- [React Helmet](https://github.com/nfl/react-helmet) - SEO
- [React Hook Form](https://react-hook-form.com/) - Formulários

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** - Gerenciador de pacotes
- **Git** - [Download](https://git-scm.com/)
- **Conta Supabase** - [Criar conta](https://supabase.com/)
- **Conta Hostinger Ecommerce** (opcional) - Para produtos
- **Conta Mercado Pago** (opcional) - Para pagamentos

---

## 🚀 Instalação

### 1. **Clone o repositório**

```bash
git clone https://github.com/Aldebaran-LW/LWDigitalForge_Texte.git
cd LWDigitalForge_Texte
```

### 2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

---

## ⚙️ Configuração

### 1. **Configure as variáveis de ambiente**

Copie o arquivo de exemplo e configure suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:

```env
# SUPABASE
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# MERCADO PAGO (opcional)
VITE_MERCADOPAGO_PUBLIC_KEY=sua_chave_publica_aqui
```

### 2. **Configure o Supabase**

#### **a) Crie um projeto no Supabase**
1. Acesse [Supabase Dashboard](https://app.supabase.com/)
2. Crie um novo projeto
3. Copie a URL e a chave `anon` para o `.env`

#### **b) Configure a autenticação**

**No Dashboard do Supabase:**
1. Vá em **Authentication** → **Providers**
2. Habilite **Email** (já vem habilitado)
3. Para **Google OAuth**:
   - Habilite o provider Google
   - Configure Client ID e Secret do Google Cloud Console
   - Adicione a URL de callback: `https://seu-projeto.supabase.co/auth/v1/callback`

#### **c) Configure o Storage (opcional)**

Se for usar uploads de imagens:
1. Vá em **Storage** → **Create bucket**
2. Crie um bucket chamado `assets-publicos`
3. Configure as políticas de acesso público

#### **d) Execute as migrations**

```bash
# Conecte o Supabase CLI (se tiver migrations)
npx supabase link --project-ref seu-projeto-ref
npx supabase db push
```

### 3. **Configure o Google OAuth (opcional)**

Para login com Google:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto (ou use existente)
3. Vá em **APIs & Services** → **Credentials**
4. Crie um **OAuth 2.0 Client ID**
5. Adicione as **Authorized redirect URIs**:
   ```
   https://seu-projeto.supabase.co/auth/v1/callback
   ```
6. Copie o Client ID e Secret para o Supabase

---

## 🏃 Executando o Projeto

### **Modo de Desenvolvimento**

```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em: [http://localhost:3000](http://localhost:3000)

### **Build de Produção**

```bash
npm run build
# ou
yarn build
```

### **Preview do Build**

```bash
npm run preview
# ou
yarn preview
```

---

## 📁 Estrutura do Projeto

```
LWDigitalForge_Texte/
├── public/                  # Arquivos públicos estáticos
│   └── Logo.png            # Logo da marca
├── src/
│   ├── api/                # APIs e serviços externos
│   │   └── EcommerceApi.js # Integração Hostinger Ecommerce
│   ├── components/         # Componentes React
│   │   ├── admin/         # Componentes do painel admin
│   │   ├── portal/        # Componentes do portal cliente
│   │   ├── ui/            # Componentes UI (shadcn)
│   │   ├── Header.jsx     # Cabeçalho
│   │   ├── Footer.jsx     # Rodapé
│   │   └── ...
│   ├── contexts/          # Context APIs
│   │   ├── SupabaseAuthContext.jsx  # Autenticação
│   │   └── ThemeContext.jsx         # Tema claro/escuro
│   ├── hooks/             # Custom hooks
│   │   └── useCart.jsx    # Hook do carrinho
│   ├── pages/             # Páginas/Rotas
│   │   ├── admin/        # Páginas admin
│   │   ├── portal/       # Páginas portal
│   │   ├── HomePage.jsx  # Página inicial
│   │   └── ...
│   ├── config/            # Configurações
│   │   └── assets.js     # URLs de assets do Supabase
│   ├── lib/               # Bibliotecas e utils
│   │   ├── customSupabaseClient.js  # Cliente Supabase
│   │   └── utils.js      # Utilitários
│   ├── utils/             # Funções utilitárias
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Entry point
│   └── index.css          # Estilos globais
├── supabase/              # Configuração Supabase
│   ├── functions/        # Edge Functions
│   └── migrations/       # Migrations do banco
├── .env                   # Variáveis de ambiente (não commitado)
├── .env.example          # Exemplo de variáveis
├── .gitignore            # Arquivos ignorados pelo Git
├── package.json          # Dependências do projeto
├── vite.config.js        # Configuração do Vite
├── tailwind.config.js    # Configuração do Tailwind
├── vercel.json           # Configuração do Vercel
└── README.md             # Este arquivo
```

---

## 🌐 Deploy

### **Deploy Automático via GitHub Actions (Recomendado)**

O projeto está configurado com GitHub Actions para deploy automático na Vercel.

#### **1. Configurar Secrets no GitHub**

1. Acesse seu repositório no GitHub
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Adicione os seguintes secrets:

   **Secrets do Vercel:**
   - `VERCEL_TOKEN`: Token de acesso do Vercel
     - Obtenha em: [Vercel Settings → Tokens](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID`: ID da organização no Vercel
     - Obtenha em: [Vercel Settings → General](https://vercel.com/account/general)
   - `VERCEL_PROJECT_ID`: ID do projeto no Vercel
     - Obtenha no arquivo `.vercel/project.json` após primeiro deploy manual, ou no dashboard do Vercel

   **Secrets de Ambiente (para build):**
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase
   - `VITE_MERCADOPAGO_PUBLIC_KEY`: Chave pública do Mercado Pago

#### **2. Primeiro Deploy Manual (para obter IDs)**

1. **Instale o Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **Deploy inicial:**
   ```bash
   vercel
   ```

4. **Após o deploy, obtenha os IDs:**
   - O arquivo `.vercel/project.json` será criado com os IDs
   - Ou acesse o dashboard do Vercel para obter os IDs

5. **Adicione os IDs como secrets no GitHub** (conforme passo 1)

#### **3. Deploy Automático**

Após configurar os secrets, o deploy será automático a cada push na branch `main`:
- O workflow `.github/workflows/vercel_deploy.yml` será executado
- O build será feito com as variáveis de ambiente configuradas
- O deploy será feito automaticamente na Vercel

### **Deploy Manual no Vercel (Alternativa)**

1. **Conecte seu repositório GitHub ao Vercel:**
   - Acesse [vercel.com](https://vercel.com/)
   - Clique em "New Project"
   - Importe o repositório do GitHub

2. **Configure as variáveis de ambiente:**
   - No painel do Vercel, vá em **Settings** → **Environment Variables**
   - Adicione todas as variáveis:
     ```
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
     VITE_MERCADOPAGO_PUBLIC_KEY
     ```

3. **Deploy:**
   - O Vercel fará o deploy automaticamente a cada push na branch principal
   - Acesse o link gerado pelo Vercel

### **Configurações Importantes do Vercel**

O arquivo `vercel.json` já está configurado para SPA routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### **Troubleshooting do Deploy**

- **Erro de build:** Verifique se todas as variáveis de ambiente estão configuradas
- **Erro de secrets:** Verifique se os secrets do GitHub Actions estão configurados corretamente
- **Deploy não executa:** Verifique se o workflow está na branch `main` e se os secrets estão configurados

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### **Padrões de Commit**

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

---

## 📄 Licença

Este projeto é privado e proprietário. Todos os direitos reservados.

© 2025 LWDigitalForge. Criado por Lucas Wander.

---

## 📞 Contato

- **Website:** [LWDigitalForge](https://lwdigitalforge.vercel.app)
- **Email:** contato@lwdigitalforge.com
- **GitHub:** [@Aldebaran-LW](https://github.com/Aldebaran-LW)

---

## 🙏 Agradecimentos

- [Supabase](https://supabase.com/) - Backend incrível
- [Vercel](https://vercel.com/) - Hospedagem perfeita
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS maravilhoso
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela! ⭐**

</div>



