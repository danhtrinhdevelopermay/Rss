# NewsHub - News Management & RSS System

## Overview

NewsHub is a full-stack news management system built with React, Express, and PostgreSQL. It provides a comprehensive platform for creating, managing, and distributing news articles through both web interface and RSS feeds. The system supports multiple article statuses (draft, published, scheduled), categorization, tagging, and view tracking, making it suitable for content creators and news organizations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA**: Modern React application using functional components and hooks
- **Routing**: Client-side routing implemented with Wouter for lightweight navigation
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod schema validation for type-safe forms

### Backend Architecture
- **Express.js Server**: RESTful API server with middleware for JSON parsing and request logging
- **TypeScript**: Full TypeScript implementation for type safety across the stack
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database implementations
- **Error Handling**: Centralized error handling middleware with proper status codes and messages
- **Development Setup**: Vite integration for hot module replacement during development

### Database Design
- **PostgreSQL**: Primary database using Drizzle ORM for type-safe database operations
- **Schema**: Two main entities - Articles and Users with proper relationships and constraints
- **Article Management**: Support for drafts, publishing, scheduling with metadata like views, tags, categories
- **Migration System**: Drizzle-kit for database schema migrations and version control

### API Structure
- **RESTful Endpoints**: Standard CRUD operations for articles with proper HTTP methods
- **RSS Feed Generation**: Dynamic RSS XML generation from published articles
- **Statistics API**: Aggregate data endpoints for dashboard metrics
- **Content Management**: Full article lifecycle management (create, update, delete, publish)

### Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL session store
- **User Management**: Basic user system with username/password authentication
- **Route Protection**: Middleware-based route protection for administrative functions

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver for database connectivity
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration toolkit for PostgreSQL
- **express**: Web application framework for the backend API
- **vite**: Build tool and development server with HMR support

### UI & Styling Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives (dialogs, dropdowns, forms, etc.)
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for creating variant-based component APIs
- **lucide-react**: Icon library providing consistent iconography

### Development & Build Tools
- **tsx**: TypeScript execution engine for development
- **esbuild**: Fast bundler for production server builds
- **postcss & autoprefixer**: CSS processing and vendor prefixing
- **@replit/vite-plugin-***: Replit-specific plugins for development environment

### Data Management Dependencies
- **@tanstack/react-query**: Server state management and caching
- **zod**: Schema validation for forms and API data
- **date-fns**: Date manipulation and formatting utilities
- **wouter**: Lightweight client-side routing library

### Third-party Integrations
- **RSS Feed Generation**: Custom RSS XML generation for content syndication
- **Session Storage**: PostgreSQL-backed session management for user persistence
- **File Upload Support**: Basic file handling for article images and media
- **Form Validation**: Comprehensive form validation using React Hook Form and Zod schemas