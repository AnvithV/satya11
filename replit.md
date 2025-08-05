# Overview

Final Frontier AI is a comprehensive editorial quality assurance platform that acts as a digital senior editor for content creators. The application provides AI-powered analysis of written content, checking for grammar, clarity, style compliance, bias detection, and fact-checking against trusted sources. It features a modern web interface with document management capabilities, real-time content editing, and detailed analysis reporting.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React with TypeScript and follows a modern component-based architecture:

- **UI Framework**: React 18 with TypeScript for type safety and maintainability
- **Styling**: Tailwind CSS with a custom design system using CSS variables and shadcn/ui components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds
- **Component Library**: Comprehensive shadcn/ui component system with Radix UI primitives

The frontend implements a three-page structure:
1. Landing page for unauthenticated users
2. Dashboard/home page for document overview
3. Editor page with sidebar, main editor, and analysis panel

## Backend Architecture
The server follows a Node.js Express-based REST API pattern:

- **Runtime**: Node.js with TypeScript using tsx for development
- **Framework**: Express.js with custom middleware for logging and error handling
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **File Processing**: Multer for handling document uploads with memory storage
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple

The API structure includes:
- Authentication routes integrated with Replit Auth
- Document CRUD operations with user ownership validation
- AI analysis endpoints for content processing
- File upload handling for document creation

## Data Storage Solutions
The application uses PostgreSQL as the primary database with a well-structured schema:

- **Users Table**: Stores user profiles with Replit Auth integration
- **Documents Table**: Manages document content, metadata, and status tracking
- **Analysis Results Table**: Stores AI analysis findings with categorization
- **Sessions Table**: Handles user session persistence for authentication

Database operations are handled through Drizzle ORM, providing type safety and migration support. The schema supports both in-memory storage for development and PostgreSQL for production.

## Authentication and Authorization
Authentication is handled through Replit's OAuth integration:

- **Provider**: Replit OAuth with OpenID Connect
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Security**: HTTP-only cookies with secure flags for production
- **Authorization**: Route-level protection with user ownership validation for documents

The system implements mandatory user operations required for Replit Auth compatibility, including user creation, retrieval, and session management.

## AI Integration Architecture
The application integrates with OpenAI's GPT-4o model for content analysis:

- **Service Layer**: Dedicated AI analysis service handling OpenAI API communication
- **Analysis Types**: Supports critical issues, suggestions, and verified content detection
- **Response Processing**: Structured analysis results with confidence scoring and categorization
- **Error Handling**: Robust error handling for API failures and rate limiting

The AI service processes documents through a sophisticated prompt system that analyzes content for editorial quality, factual accuracy, and style compliance.

# External Dependencies

## Core Infrastructure
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Cloud Platform**: Replit hosting and deployment infrastructure
- **CDN**: Replit's static asset serving for production builds

## Authentication Services
- **Replit Auth**: OAuth provider using OpenID Connect protocol
- **Session Storage**: PostgreSQL-backed session management with connect-pg-simple

## AI and Machine Learning
- **OpenAI API**: GPT-4o model for content analysis and fact-checking
- **API Configuration**: Requires OPENAI_API_KEY environment variable

## Development and Build Tools
- **Package Management**: npm with extensive UI component ecosystem
- **Build System**: Vite for frontend bundling and esbuild for backend compilation
- **Development Experience**: Hot module replacement and TypeScript compilation

## UI Component Ecosystem
- **Radix UI**: Comprehensive primitive component library for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent visual elements
- **TanStack Query**: Advanced server state management with caching and synchronization

The application leverages modern web development practices with a focus on type safety, performance, and user experience through carefully selected dependencies and architectural patterns.