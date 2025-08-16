# Mani News - Sistema de Notícias

Um sistema completo de notícias com painel administrativo, desenvolvido com React, TypeScript, Node.js e PostgreSQL.

## 🚀 Funcionalidades

### Frontend Público
- 📱 **PWA (Progressive Web App)** - Instalável como app nativo
- 🎨 **Design Responsivo** - Interface moderna e mobile-first
- 🔍 **Sistema de Busca** - Busca em tempo real por artigos
- 📑 **Categorização** - Organização por categorias
- 📊 **Carrossel de Notícias** - Destaque para principais notícias
- 🔗 **Compartilhamento Social** - WhatsApp, Facebook e cópia de link
- 👁️ **Contador de Visualizações** - Tracking automático de views

### Painel Administrativo
- 🔐 **Sistema de Autenticação** - Login seguro com JWT
- 📝 **Gerenciamento de Artigos** - Criar, editar e remover artigos
- 🗂️ **Gerenciamento de Categorias** - Organização completa
- ⚙️ **Configurações do Site** - Nome, logo, cores, SEO
- 📊 **Dashboard** - Estatísticas e visão geral
- 🖼️ **Upload de Imagens** - Sistema de mídia integrado
- 👥 **Gerenciamento de Usuários** - Controle de acesso

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** com TypeScript
- **Wouter** para roteamento
- **TanStack Query** para gerenciamento de estado
- **Tailwind CSS** com design system personalizado
- **Radix UI** para componentes acessíveis
- **Embla Carousel** para carrosséis
- **Framer Motion** para animações

### Backend
- **Node.js** com Express
- **TypeScript** em todo o projeto
- **Drizzle ORM** para banco de dados
- **PostgreSQL** como banco de dados
- **JWT** para autenticação
- **Bcrypt** para hash de senhas
- **Multer** para upload de arquivos

### Infraestrutura
- **Vite** como bundler
- **ESBuild** para build de produção
- **Drizzle Kit** para migrações
- **Cross-env** para compatibilidade Windows/Linux

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 13+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/matheus11999/mani-news2.git
cd mani-news2
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL=postgres://mani:260520jm@evoapi_maninews-postgres:5432/mani?sslmode=disable
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
PORT=5000
```

### 4. Execute as migrações do banco
```bash
npm run db:push
```

### 5. Build e Start
```bash
npm run build
npm start
```

## 🗂️ Estrutura do Projeto

```
mani-news2/
├── client/                    # Frontend React
│   ├── public/               # Arquivos públicos e PWA
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── admin/        # Componentes do painel admin
│   │   │   ├── layout/       # Layout components
│   │   │   ├── news/         # Componentes de notícias
│   │   │   ├── ui/           # Componentes UI (Radix)
│   │   │   └── ...
│   │   ├── pages/            # Páginas da aplicação
│   │   │   ├── admin/        # Páginas administrativas
│   │   │   └── ...
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilitários
│   │   └── ...
├── server/                   # Backend Express
│   ├── auth.ts              # Sistema de autenticação
│   ├── db.ts                # Configuração do banco
│   ├── storage.ts           # Camada de dados
│   ├── routes.ts            # Rotas públicas
│   ├── admin-routes.ts      # Rotas administrativas
│   └── ...
├── shared/                   # Código compartilhado
│   └── schema.ts            # Esquemas Drizzle e Zod
└── migrations/              # Migrações do banco
```

## 🔑 Acesso Administrativo

### Primeiro Acesso
1. Acesse `/admin/register` para criar o primeiro usuário administrador
2. O primeiro usuário será automaticamente definido como admin
3. Após o registro, faça login em `/admin/login`

### URLs Administrativas
- **Login**: `/admin/login`
- **Dashboard**: `/admin`
- **Artigos**: `/admin/articles`
- **Categorias**: `/admin/categories`
- **Configurações**: `/admin/settings`

## 📊 Banco de Dados

### Tabelas Principais
- **users** - Usuários do sistema
- **categories** - Categorias de artigos
- **articles** - Artigos e notícias
- **site_config** - Configurações do site

### Schema
O schema completo está definido em `shared/schema.ts` usando Drizzle ORM.

## 🚀 Deploy

### Deploy Automatizado na Sua Infraestrutura

1. **Clone o repositório na máquina de produção:**
```bash
git clone https://github.com/matheus11999/mani-news2.git
cd mani-news2
```

2. **Configure a variável de ambiente do PostgreSQL:**
```bash
export DATABASE_URL="postgres://mani:260520jm@evoapi_maninews-postgres:5432/mani?sslmode=disable"
export JWT_SECRET="your-super-secret-jwt-key"
export NODE_ENV="production"
export PORT="3000"
```

3. **Instale dependências e configure o banco:**
```bash
npm install
npm run db:push    # Cria as tabelas no PostgreSQL
npm run db:init    # Inicializa dados padrão
```

4. **Inicie a aplicação:**
```bash
npm start
```

### Deploy no Heroku (Opcional)
```bash
heroku create mani-news-app
heroku addons:create heroku-postgresql:essential-0
git push heroku main
```

### Deploy no EasyPanel
O projeto está configurado para deploy automático no EasyPanel:
- As variáveis de ambiente serão configuradas automaticamente
- O PostgreSQL deve estar rodando no container `evoapi_maninews-postgres`
- A aplicação estará disponível na porta 3000

### Verificação Pós-Deploy
1. Acesse a aplicação na URL configurada
2. Vá para `/admin/register` para criar o primeiro usuário administrador
3. Faça login em `/admin/login`
4. Configure o site em `/admin/settings`

## 📱 PWA Features
- **Manifest** configurado para instalação
- **Service Worker** para cache offline
- **Install Prompt** customizado
- **Ícones** para diferentes tamanhos

## 🎨 Customização

### Cores e Tema
As cores principais podem ser alteradas em:
- `client/src/index.css` (CSS variables)
- `tailwind.config.ts` (Tailwind theme)
- Painel admin > Configurações

### Logo e Branding
- Substitua os arquivos em `client/public/`
- Configure no painel admin

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm start           # Servidor de produção
npm run check       # Type checking
npm run db:push     # Migrações do banco
```

## 🛡️ Segurança

- ✅ **Autenticação JWT** com expiração
- ✅ **Hash de senhas** com bcrypt
- ✅ **Validação de input** com Zod
- ✅ **Proteção XSS** React built-in
- ✅ **SQL Injection** prevenção via Drizzle ORM
- ✅ **Upload de arquivos** com validação

## 📄 API Endpoints

### Públicos
- `GET /api/articles` - Lista artigos
- `GET /api/articles/:slug` - Artigo específico
- `GET /api/categories` - Lista categorias
- `GET /api/articles/search` - Busca artigos

### Administrativos (requerem autenticação)
- `POST /api/admin/login` - Login
- `GET /api/admin/articles` - Gerenciar artigos
- `POST /api/admin/articles` - Criar artigo
- `PUT /api/admin/articles/:id` - Editar artigo
- `DELETE /api/admin/articles/:id` - Remover artigo
- Similar para categorias e configurações

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Email: contato@maninews.com

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Mani News** - Sistema completo de notícias com painel administrativo 🚀