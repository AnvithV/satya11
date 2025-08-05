# Overview

Final Frontier AI is a comprehensive multi-agent editorial quality assurance platform that transforms document review through specialized AI agents. The system features five distinct editing stages (Copy Editors, Fact Checkers, Standards & Ethics, Legal Department, and Archivists) that provide targeted analysis with color-coded highlighting. Documents are uploaded without highlighting initially, then users can select specific editing stages to reveal targeted feedback flags that can be dismissed or applied with detailed explanations.

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

The frontend implements a comprehensive multi-agent interface:
1. Home page with document management, upload functionality, and status tracking
2. Editor page with three-column layout: editing stages sidebar, document content with selective highlighting, and analysis results panel
3. Interactive flag system with expandable dropdowns, dismiss/apply actions, and stage-specific color coding

## Backend Architecture
The server follows a Node.js Express-based REST API pattern:

- **Runtime**: Node.js with TypeScript using tsx for development
- **Framework**: Express.js with custom middleware for logging and error handling
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **File Processing**: Multer for handling document uploads with memory storage
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple

The API structure includes:
- Authentication routes integrated with Replit Auth
- Document CRUD operations with user ownership validation and stage tracking
- Stage-specific AI analysis endpoints for targeted content processing
- Flag management routes for dismissing and applying suggested fixes
- File upload handling with automatic document parsing and content extraction

## Data Storage Solutions
The application uses PostgreSQL as the primary database with a well-structured schema:

- **Users Table**: Stores user profiles with Replit Auth integration
- **Documents Table**: Manages document content, metadata, status tracking, current editing stage, and completed stages array
- **Analysis Results Table**: Stores stage-specific AI analysis findings with categorization, severity levels, dismissal status, and applied fix tracking
- **Sessions Table**: Handles user session persistence for authentication

Database operations are handled through Drizzle ORM, providing type safety and migration support. The schema supports both in-memory storage for development and PostgreSQL for production.

## Authentication and Authorization
Authentication is handled through Replit's OAuth integration:

- **Provider**: Replit OAuth with OpenID Connect
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Security**: HTTP-only cookies with secure flags for production
- **Authorization**: Route-level protection with user ownership validation for documents

The system implements mandatory user operations required for Replit Auth compatibility, including user creation, retrieval, and session management.

## Multi-Agent AI Architecture
The application implements a sophisticated multi-agent system using OpenAI's GPT-4o model:

### Editing Stages & Specialized Agents:
1. **Copy Editors** (Blue) - Grammar, spelling, style guide compliance, and readability optimization
2. **Fact Checkers** (Green) - Source verification, factual accuracy, quote validation, and cross-referencing
3. **Standards & Ethics** (Purple) - Bias detection, inclusivity analysis, sensitivity review, and framing assessment
4. **Legal Department** (Red) - Defamation risk, privacy violations, copyright compliance, and regulatory review
5. **Archivists** (Amber) - Historical consistency, cross-reference opportunities, and archive integration

### Analysis Processing:
- **Stage-Specific Prompts**: Each agent uses specialized system prompts tailored to their expertise area
- **Selective Highlighting**: Flags only appear when specific editing stages are selected
- **Interactive Flag Management**: Users can expand flags for detailed explanations, dismiss false positives, or apply suggested fixes
- **Severity Classification**: Issues are categorized as low, medium, high, or critical severity with appropriate visual indicators
- **Confidence Scoring**: Each analysis result includes confidence levels and specific category classifications

### User Experience Features:
- **Progressive Disclosure**: Clean document view initially, with targeted highlighting only when specific stages are selected
- **Color-Coded System**: Each editing stage has distinct colors for immediate visual identification
- **Expandable Analysis**: Collapsible flag panels with detailed explanations and actionable suggestions
- **Status Tracking**: Home page shows completion status for each editing stage across all documents

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