# Overview

Mani News is a modern Progressive Web Application (PWA) built for delivering news content with a mobile-first approach. The application features a React frontend with TypeScript, an Express.js backend, and comprehensive SEO optimization. The platform is designed to provide real-time news consumption with social sharing capabilities, particularly focused on WhatsApp integration for the Brazilian market.

The application follows a full-stack architecture with server-side rendering capabilities during development and static generation for production. It implements modern web standards including PWA features, lazy loading, and optimized performance for mobile devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React 18 with TypeScript and follows a component-based architecture. The application uses Wouter for client-side routing, providing a lightweight alternative to React Router. State management is handled through TanStack Query (React Query) for server state and React's built-in state management for local UI state.

The UI framework leverages Radix UI primitives with a custom design system built on top of Tailwind CSS. The styling system uses CSS variables for theming and follows the shadcn/ui component patterns for consistency and maintainability.

Key architectural decisions:
- **Routing**: Wouter provides file-based routing with dynamic parameters
- **State Management**: TanStack Query for server state caching and synchronization
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Component Library**: Radix UI primitives with custom styling layer

## Backend Architecture

The backend follows a RESTful API design using Express.js with TypeScript. The application implements a layered architecture with clear separation between routes, storage, and business logic. The storage layer uses an abstraction pattern to support both in-memory storage (for development) and database persistence.

The server integrates with Vite during development for hot module replacement and serves the built React application in production. Error handling is centralized with consistent JSON responses across all endpoints.

Key architectural decisions:
- **API Design**: RESTful endpoints with consistent response patterns
- **Storage Abstraction**: Interface-based storage layer for flexibility
- **Development Integration**: Vite middleware for seamless development experience
- **Error Handling**: Centralized error middleware with structured responses

## Data Storage Solutions

The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema defines three main entities: users, categories, and articles, with proper relationships and constraints.

For development and testing, the application includes an in-memory storage implementation that mirrors the production database interface. This allows for rapid development without database dependencies.

Database design decisions:
- **ORM**: Drizzle ORM provides type safety and modern SQL generation
- **Schema**: Normalized design with clear entity relationships
- **Development Storage**: In-memory implementation for rapid prototyping
- **Migrations**: Drizzle Kit handles schema migrations and database synchronization

## SEO and Performance Optimization

The application implements comprehensive SEO optimization including server-side meta tag generation, Open Graph protocol support, and JSON-LD structured data. The SEO system is component-based, allowing for dynamic meta tag updates based on route and content.

Performance optimizations include lazy loading for images, code splitting for JavaScript bundles, and service worker caching for offline functionality. The PWA implementation provides app-like experience with installation prompts and offline content access.

SEO and performance features:
- **Meta Tag Management**: Dynamic SEO head component with Open Graph and Twitter Card support
- **Structured Data**: JSON-LD implementation for search engine understanding
- **Image Optimization**: Lazy loading with proper alt text and responsive sizing
- **Caching Strategy**: Service worker implementation for offline content access

## PWA Implementation

The application implements full PWA capabilities including a web app manifest, service worker for caching, and installation prompts. The PWA features enable offline content consumption and native app-like behavior on mobile devices.

The service worker implements a cache-first strategy for static assets and a network-first strategy for dynamic content. Installation prompts are contextually triggered based on user engagement and browser support.

PWA architectural components:
- **Manifest**: Complete app metadata with proper icons and display modes
- **Service Worker**: Caching strategies for different content types
- **Installation**: Native installation prompts with user engagement tracking
- **Offline Support**: Graceful degradation for offline scenarios

# External Dependencies

## Database Infrastructure
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management
- **Drizzle Kit**: Database migration and introspection tooling

## UI and Styling Framework
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Tailwind Variants**: Dynamic component styling with variant support
- **shadcn/ui**: Component system built on Radix UI and Tailwind CSS

## React Ecosystem
- **TanStack Query**: Server state management and caching layer
- **Wouter**: Lightweight client-side routing library
- **React Hook Form**: Form state management with validation
- **React**: Core framework with TypeScript support

## Development and Build Tools
- **Vite**: Build tool and development server with HMR support
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## External Content and Services
- **Unsplash**: Stock photography for article featured images
- **WhatsApp Web API**: Social sharing integration for news articles
- **Google Fonts**: Inter font family for typography
- **Web Share API**: Native sharing capabilities on supported devices

## Validation and Utilities
- **Zod**: Schema validation for API requests and responses
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Component variant management
- **clsx**: Conditional CSS class name utility