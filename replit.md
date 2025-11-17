# Blockchain Loyalty Points Platform

## Overview

A gamified blockchain-based loyalty points platform built on CARV SVM Testnet where users earn points through daily check-ins, Twitter engagement, and AI chatbot interactions. The platform features a bilingual (Arabic/English) interface with RTL support, wallet integration via BackPack, and Web3-inspired gamification mechanics including streaks, leaderboards, and achievement tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**UI Component System**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. The design system follows a "New York" style configuration with extensive use of CSS variables for theming.

**Routing**: Wouter for client-side routing (lightweight React Router alternative)

**State Management**: TanStack Query (React Query) v5 for server state management with custom query client configuration. No global state management library - relies on React Query's cache and local component state.

**Styling Approach**: 
- Tailwind CSS with custom design tokens
- Cairo font for Arabic/Latin support, Space Grotesk for numbers/crypto addresses
- Custom CSS variables for light/dark mode theming
- RTL-aware layouts for Arabic language support
- Elevation system using shadow utilities

**Key Design Patterns**:
- Gamification-first UI with prominent point displays, streak mechanics, and progress indicators
- Mobile-responsive grid layouts (3-column stats, 2-column task cards)
- Component composition using Radix UI primitives
- Custom hooks for mobile detection and toast notifications

### Backend Architecture

**Runtime**: Node.js with Express.js server

**Language**: TypeScript with ESM modules

**API Design**: RESTful endpoints under `/api` namespace
- User management: `/api/user/:walletAddress`
- Check-ins: `/api/checkin/*`
- Twitter activities: `/api/twitter/*`
- Chat interactions: `/api/chat/*`

**Storage Layer**: In-memory storage implementation (MemStorage class) implementing IStorage interface. Designed for easy migration to persistent database (Drizzle ORM configuration present for PostgreSQL).

**Request Processing**:
- JSON body parsing with raw body verification for webhooks
- Request/response logging middleware for API routes
- Duration tracking for performance monitoring

**Development Setup**: Vite middleware integration for HMR during development, static file serving in production

### Data Storage

**ORM**: Drizzle ORM configured for PostgreSQL (via Neon serverless driver)

**Schema Design**:
- `users`: Wallet addresses, Twitter integration, points, streaks, levels
- `dailyCheckIns`: Blockchain transaction signatures, streak tracking
- `twitterActivities`: Tweet tracking, hashtag verification, partner project integration
- `chatInteractions`: Daily message limits, points tracking
- `chatMessages`: Conversation history (user/assistant messages)
- `pointsTransactions`: Audit trail for all point changes
- `partnerProjects`: Twitter campaign management

**Data Relationships**: User-centric design with foreign keys linking all activities to user records

**Migration Strategy**: Drizzle Kit configured with schema at `./shared/schema.ts` and migrations output to `./migrations`

### Authentication & Authorization

**Wallet-Based Authentication**: BackPack wallet connection as primary identity mechanism
- No traditional username/password authentication
- Wallet address serves as unique user identifier
- Auto-create user on first wallet connection

**Session Management**: Currently wallet-based, no explicit session storage mentioned (likely ephemeral client-side wallet connection state)

**Authorization Model**: Wallet address used to scope all user data access

### Blockchain Integration

**Network**: CARV SVM Testnet (Solana Virtual Machine compatible)

**RPC Endpoint**: `https://rpc.testnet.carv.io/rpc`

**Wallet Provider**: BackPack wallet browser extension

**On-Chain Operations**:
- Daily check-in transactions generate blockchain signatures
- Transaction signatures stored as proof of check-in completion
- Simplified implementation without heavy Solana SDK dependencies

**Integration Pattern**: Client-side wallet interaction with server-side signature verification

## External Dependencies

### Third-Party Services

**OpenAI API**: GPT-5 model for AI chatbot interactions
- Used in server-side chat message endpoint
- API key configured via environment variable `OPENAI_API_KEY`

**Twitter Integration**: Twitter API for activity verification
- Hashtag tracking for partner campaigns
- Tweet verification system
- Twitter handles and IDs stored for user profiles

**CARV SVM Testnet**: Blockchain network for transaction recording
- RPC endpoint for transaction submission
- BackPack wallet as signing interface

### UI Libraries

**Component Framework**: Radix UI (comprehensive suite of 30+ primitives)
- Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
- Popover, Progress, Radio Group, Select, Slider, Switch, Tabs
- Toast, Tooltip, Navigation Menu, Context Menu, Hover Card
- Full accessibility support built-in

**Styling**: 
- Tailwind CSS v3 with PostCSS
- class-variance-authority for component variants
- clsx + tailwind-merge for className management

**Form Handling**:
- React Hook Form (via `@hookform/resolvers`)
- Zod for schema validation (drizzle-zod integration)

**Data Visualization**: date-fns for date formatting, embla-carousel-react for carousels

### Database

**Provider**: Neon serverless PostgreSQL (via `@neondatabase/serverless`)

**Connection**: DATABASE_URL environment variable required

**Session Store**: connect-pg-simple for potential Express session storage (configured but not actively used with current wallet-auth approach)

### Development Tools

**Build System**: Vite with React plugin and custom Replit plugins
- Runtime error overlay
- Development banner
- Cartographer integration

**Type Checking**: TypeScript with strict mode enabled

**Code Quality**: ESM-first codebase with path aliases (@/, @shared/, @assets/)