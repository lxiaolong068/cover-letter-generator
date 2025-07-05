# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `pnpm dev` - Start development server on http://localhost:3000
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Testing

- `pnpm test` - Run unit tests with Vitest
- `pnpm test:ui` - Run tests with UI
- `pnpm test:e2e` - Run end-to-end tests with Playwright
- `pnpm test:e2e:ui` - Run E2E tests with UI

### Database Management

- `pnpm migrate` - Run all pending migrations
- `pnpm migrate:up` - Run all pending migrations (explicit)
- `pnpm migrate:list` - List applied migrations
- `pnpm migrate:rollback <id>` - Rollback specific migration
- `pnpm db:health` - Check database connection

## Architecture Overview

### Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4.0 with custom design system
- **AI**: OpenRouter API with multiple model support (GPT-4, Claude, Llama)
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: Custom JWT-based auth with sessions
- **Testing**: Vitest (unit), Playwright (E2E), React Testing Library
- **Deployment**: Vercel with edge functions

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public pages (SSG)
│   ├── dashboard/          # Protected pages (SSR)
│   ├── api/                # API routes (edge functions)
│   └── components/         # Component showcase
├── components/             # Reusable UI components
│   ├── ui/                 # Core UI components
│   ├── seo/                # SEO components
│   ├── accessibility/      # Accessibility features
│   └── pwa/                # PWA components
├── lib/                    # Utility functions
│   ├── openrouter.ts       # OpenRouter API setup
│   ├── neon.ts             # Database utilities
│   └── ai.ts               # AI generation logic
└── styles/                 # Global styles and design tokens
```

### Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts and profiles
- `user_sessions` - JWT authentication sessions
- `cover_letters` - Generated cover letters with metadata
- `migrations` - Migration tracking

### AI Model Configuration

- **Default Model**: GPT-4o Mini (balance of quality and cost)
- **Cover Letter Generation**: GPT-4o Mini with 0.7 temperature
- **Content Analysis**: GPT-4o with 0.3 temperature
- **Quick Responses**: GPT-3.5 Turbo with 0.5 temperature

## Development Workflow

### Environment Setup

1. Install dependencies: `pnpm install`
2. Copy environment variables: `cp .env.example .env.local`
3. Run migrations: `pnpm migrate`
4. Start development server: `pnpm dev`

### Required Environment Variables

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEON_DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/neondb
NEON_DATABASE_URL_UNPOOLED=postgresql://username:password@ep-xxx.neon.tech/neondb?pgbouncer=false
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Setting Up Google OAuth

To enable Google OAuth authentication, you'll need to obtain credentials from Google Cloud Console:

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable billing if required (OAuth is free within limits)

2. **Enable Google+ API**
   - In the Google Cloud Console, navigate to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
   - Alternatively, enable "Google Identity" API for newer implementations

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Configure the OAuth consent screen first if prompted:
     - Choose "External" user type for public applications
     - Fill in required fields: App name, User support email, Developer contact
     - Add your domain to "Authorized domains" (for production)
   - Select "Web application" as application type
   - Add authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`

4. **Copy Credentials**
   - Copy the "Client ID" to `GOOGLE_CLIENT_ID`
   - Copy the "Client Secret" to `GOOGLE_CLIENT_SECRET`

5. **Security Notes**
   - Keep your Client Secret secure and never commit it to version control
   - Use different OAuth apps for development and production environments
   - Regularly rotate your Client Secret for enhanced security
   - Configure appropriate scopes (email, profile) in your OAuth consent screen

### Code Standards

- TypeScript strict mode enabled
- ESLint with Next.js config
- Prettier with Tailwind plugin
- Conventional commits preferred
- Pre-commit hooks with Husky and lint-staged

### Testing Strategy

- Unit tests for utilities and components
- E2E tests for critical user flows
- Browser testing: Chrome, Firefox, Safari, Mobile
- Accessibility testing built-in

## Key Features

### PWA Support

- Service Worker for offline functionality
- Web App Manifest for installability
- Update notifications and offline indicators

### SEO Optimization

- Server-side rendering for public pages
- Structured data (JSON-LD) for better search visibility
- Dynamic meta tags and Open Graph support
- Sitemap generation

### Accessibility

- WCAG 2.1 AA compliance
- Screen reader support with proper ARIA labels
- Keyboard navigation throughout
- Skip links and focus management

## API Endpoints

### Cover Letter Generation

- `POST /api/generate` - Generate cover letter with streaming response
- Supports multiple cover letter types: professional, creative, technical, executive
- Real-time streaming of AI-generated content

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Data Management

- `GET /api/cover-letters` - List user's cover letters
- `POST /api/cover-letters` - Save generated cover letter
- `DELETE /api/cover-letters/[id]` - Delete cover letter

## Development Notes

### Database Migrations

- Use unpooled connection for migrations
- Migrations are idempotent and tracked in `migrations` table
- Always test migrations in development before production

### AI Generation

- Uses streaming responses for better UX
- Supports multiple models via OpenRouter
- Generation metrics tracked for optimization

### Performance Optimizations

- Route-based code splitting
- Image optimization with Next.js Image
- Static generation for marketing pages
- ISR for dynamic content

### Security

- JWT-based authentication with httpOnly cookies
- Rate limiting on API endpoints
- Input validation and sanitization
- CSRF protection built-in
