# CLAUDE.md - Mani News

## Projeto Overview
Mani News é uma aplicação web moderna de notícias com funcionalidades PWA (Progressive Web App). É um aplicativo full-stack que combina Node.js/Express no backend com React/TypeScript no frontend, oferecendo uma experiência nativa de aplicativo móvel para leitura de notícias.

## Stack Tecnológica

### Frontend
- **React 18** com TypeScript
- **Wouter** para roteamento (alternativa leve ao React Router)
- **TanStack Query** (React Query) para gerenciamento de estado server
- **Tailwind CSS** com sistema de design personalizado
- **Radix UI** para componentes acessíveis
- **Embla Carousel** para carrosséis interativos
- **Framer Motion** para animações
- **Lucide React** para ícones

### Backend
- **Node.js** com **Express**
- **TypeScript** em todo o projeto
- **Drizzle ORM** para banco de dados
- **PostgreSQL** como banco de dados
- **Zod** para validação de esquemas

### Configuração e Build
- **Vite** como bundler e dev server
- **ESBuild** para build de produção
- **TSX** para desenvolvimento TypeScript

### PWA Features
- **Service Worker** para cache offline
- **Manifest** para instalação nativa
- **Install Prompt** customizado

## Estrutura do Projeto

```
C:\Users\mat\Desktop\ManiNews\
├── client/                      # Frontend React
│   ├── public/                  # Arquivos públicos e PWA
│   │   ├── manifest.json       # Manifest da PWA
│   │   └── sw.js              # Service Worker
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── layout/         # Header, BottomNavigation
│   │   │   ├── news/           # NewsCard, NewsCarousel, CategoryFilter
│   │   │   ├── pwa/            # InstallPrompt
│   │   │   ├── seo/            # SEOHead
│   │   │   └── ui/             # Radix UI components
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilitários
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── App.tsx            # Componente principal
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Estilos globais
│   ├── index.html             # Template HTML
│   └── tailwind.config.ts     # Configuração Tailwind
├── server/                     # Backend Express
│   ├── index.ts               # Servidor principal
│   ├── routes.ts              # API routes
│   ├── storage.ts             # Camada de dados
│   └── vite.ts                # Integração Vite
├── shared/                     # Código compartilhado
│   └── schema.ts              # Esquemas Drizzle e Zod
├── package.json               # Dependências
├── vite.config.ts            # Configuração Vite
├── drizzle.config.ts         # Configuração Drizzle ORM
└── tsconfig.json             # Configuração TypeScript
```

## Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run check        # Verificação de tipos TypeScript
```

### Produção
```bash
npm run build        # Build para produção (frontend + backend)
npm start           # Inicia servidor de produção (com cross-env para Windows)
```

### Banco de Dados
```bash
npm run db:push     # Sincroniza schema com banco de dados
```

## Configuração do Ambiente

### Variáveis de Ambiente Necessárias
```bash
DATABASE_URL=postgresql://...    # URL do PostgreSQL
NODE_ENV=development|production  # Ambiente
PORT=5000                       # Porta do servidor (padrão: 5000)
```

### Banco de Dados
O projeto utiliza **PostgreSQL** com **Drizzle ORM**. O schema está definido em `shared/schema.ts` e inclui:

- **users**: Sistema de usuários
- **categories**: Categorias de notícias
- **articles**: Artigos com relacionamento para categorias

## Arquitetura da Aplicação

### Backend (Express + Drizzle)
- **server/index.ts**: Configuração do servidor Express com middleware de logging
- **server/routes.ts**: API RESTful com endpoints para categorias e artigos
- **server/storage.ts**: Camada de abstração para operações de banco de dados
- **server/vite.ts**: Integração com Vite para desenvolvimento

### Frontend (React + TypeScript)
- **Roteamento**: Usando Wouter para navegação client-side
- **Estado Global**: TanStack Query para cache e sincronização de dados
- **Componentes**: Arquitetura baseada em componentes reutilizáveis
- **Estilização**: Tailwind CSS com design system personalizado

### API Endpoints

#### Categorias
```
GET /api/categories              # Lista todas as categorias
GET /api/categories/:slug        # Categoria específica por slug
```

#### Artigos
```
GET /api/articles               # Lista artigos (com paginação)
GET /api/articles/:slug         # Artigo específico por slug
GET /api/articles/search        # Busca artigos por query
GET /api/articles/most-viewed   # Artigos mais visualizados
```

### PWA Features
- **Manifest**: Configurado para instalação como app nativo
- **Service Worker**: Cache estratégico para funcionamento offline
- **Install Prompt**: Component customizado para promover instalação

## Design System

### Cores Principais
- **Primary**: `#e50914` (Vermelho Mani News)
- **Secondary**: `#dc2626` (Vermelho escuro)
- **Background**: `#f9fafb` (Cinza claro)

### Tipografia
- **Font Principal**: Inter (Google Fonts)
- **Font Serif**: Georgia
- **Font Mono**: Menlo

### Componentes UI
Baseados em **Radix UI** para acessibilidade:
- Buttons, Cards, Dialogs
- Accordion, Tabs, Tooltip
- Form components (Input, Select, etc.)

## Funcionalidades Principais

### 1. Homepage
- **Carousel de Notícias**: Exibe as principais notícias com autoplay
- **Grid de Artigos**: Layout responsivo com cards de notícias
- **SEO Otimizado**: Meta tags dinâmicas

### 2. Navegação
- **Header Fixo**: Logo e navegação principal
- **Bottom Navigation**: Navegação mobile-first
- **Breadcrumbs**: Navegação contextual

### 3. Artigos
- **Página Individual**: Layout otimizado para leitura
- **Contador de Views**: Tracking automático de visualizações
- **Compartilhamento**: Funcionalidades sociais

### 4. Categorias
- **Filtros**: Sistema de categorização
- **Páginas Dinâmicas**: URLs amigáveis por categoria

### 5. Busca
- **Search API**: Busca full-text nos artigos
- **Interface Responsiva**: Otimizada para mobile

## Performance e Otimizações

### Frontend
- **Code Splitting**: Carregamento lazy de páginas
- **Image Optimization**: Loading lazy e otimização de imagens
- **Bundle Optimization**: Vite para build otimizado

### Backend
- **Database Indexing**: Índices otimizados para queries frequentes
- **API Caching**: Headers de cache apropriados
- **Query Optimization**: Drizzle ORM com queries eficientes

## Desenvolvimento

### Estrutura de Componentes
```
components/
├── layout/          # Componentes de layout (Header, Navigation)
├── news/            # Componentes relacionados a notícias
├── ui/              # Componentes UI reutilizáveis
├── pwa/             # Componentes PWA específicos
└── seo/             # Componentes de SEO
```

### Padrões de Código
- **TypeScript Strict**: Tipagem rigorosa em todo o projeto
- **Component Props**: Interfaces bem definidas
- **Custom Hooks**: Lógica reutilizável
- **Error Boundaries**: Tratamento de erros

### Testing
O projeto está preparado para testing com:
- **Data-testid**: Atributos para seleção em testes
- **Component Testing**: Estrutura para testes de componentes

## Deployment

### Build de Produção
```bash
npm run build
```
Gera:
- **Frontend**: Build otimizado em `dist/public/`
- **Backend**: Bundle ESM em `dist/index.js`

### Estrutura de Produção
- **Single Port**: Frontend e backend servidos na mesma porta
- **Static Assets**: Servidos pelo Express em produção
- **Environment Variables**: Configuração via variáveis de ambiente

## Considerações de Segurança
- **Input Validation**: Zod schemas para validação
- **SQL Injection Protection**: Drizzle ORM com prepared statements
- **XSS Protection**: React built-in protection
- **CORS Configuration**: Configurado adequadamente

## Correções Implementadas

### Windows Compatibility
- **Cross-env**: Adicionado `cross-env` para compatibilidade com Windows nos scripts npm
- **Host Binding**: Servidor agora usa `localhost` no Windows em vez de `0.0.0.0`
- **Scripts Atualizados**: Comandos `dev` e `start` agora funcionam corretamente no Windows

### Página de Artigos
- **Date Handling**: Tratamento melhorado de datas para compatibilidade com diferentes formatos
- **Error Handling**: Melhor tratamento de erros na busca de artigos
- **SEO Metadata**: Correção na geração de metadados para artigos

## Monitoramento e Logging
- **Request Logging**: Middleware customizado para APIs
- **Error Handling**: Middleware global de erro
- **Performance Monitoring**: Métricas de resposta

## Futuras Melhorias
- **Authentication**: Sistema de login de usuários
- **Admin Panel**: Interface de administração
- **Analytics**: Tracking de métricas de usuário
- **Push Notifications**: Notificações PWA
- **Offline Reading**: Cache de artigos para leitura offline

## Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Servidor de desenvolvimento
npm run check        # Type checking
npm run db:push      # Sync do banco de dados
```

### Produção
```bash
npm run build        # Build completo
npm start           # Servidor de produção
```

---

*Este documento serve como guia completo para desenvolvimento e manutenção do projeto Mani News.*