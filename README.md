# Cover Letter Generator

AI-powered cover letter generator built with Next.js 15, OpenRouter API, and Neon Database. Create customized, ATS-optimized cover letters in seconds.

## ✨ Features

- 🤖 **AI-Powered Generation**: Uses OpenRouter API with multiple model options (GPT-4, Claude, Llama, etc.)
- 📄 **Multiple Templates**: Professional, creative, technical, and executive cover letter styles
- 🎯 **ATS Optimized**: Keyword optimization for Applicant Tracking Systems
- 💾 **Save & Export**: Save cover letters and export to PDF format
- 🔒 **Secure**: Built-in authentication and session management
- ⚡ **Fast**: Serverless architecture with edge functions
- 📱 **Responsive**: Mobile-first design with modern UI components
- 🎨 **Modern Design**: Interface inspired by Material Design 3.0
- ♿ **Accessible**: WCAG 2.1 AA compliant with full keyboard navigation
- 🌐 **PWA Ready**: Installable app with offline support
- 🔍 **SEO Optimized**: Structured data and meta tags for search visibility

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4.0, Custom Design System
- **UI Components**: Custom component library with CVA (Class Variance Authority)
- **AI**: OpenRouter API with Vercel AI SDK
- **Database**: Neon PostgreSQL (Serverless)
- **Authentication**: Custom JWT authentication
- **PWA**: Service Worker, Web App Manifest
- **SEO**: Structured data, meta tag optimization
- **Accessibility**: WCAG 2.1 AA compliance
- **Testing**: Vitest, Playwright, React Testing Library
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended)
- OpenRouter API key
- Neon database

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cover-letter-generator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key
   NEON_DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/neondb
   NEON_DATABASE_URL_UNPOOLED=postgresql://username:password@ep-xxx.neon.tech/neondb?pgbouncer=false
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run database migrations**

   ```bash
   pnpm migrate
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Public pages (SSG)
│   ├── dashboard/         # Protected pages (SSR)
│   ├── components/        # Component showcase pages
│   ├── offline/           # PWA offline pages
│   └── api/               # API routes (edge functions)
├── components/            # Reusable UI components
│   ├── ui/                # Core UI components
│   ├── seo/               # SEO components
│   ├── accessibility/     # Accessibility components
│   └── pwa/               # PWA components
├── lib/                   # Utility functions
│   ├── openrouter.ts     # OpenRouter API configuration
│   ├── neon.ts           # Neon database utilities
│   ├── ai.ts             # AI generation functions
│   └── utils.ts          # Common utilities
├── styles/               # Global styles and design tokens
├── content/              # MDX blog posts
└── test/                 # Test setup and utilities

scripts/
└── migrate.ts            # Database migration script

public/                   # Static assets
├── manifest.json         # PWA manifest
├── sw.js                 # Service Worker
└── icons/                # App icons
```

## 🎨 Frontend Design System

### Modern UI Components

Our design system is built on Material Design 3.0 principles:

- **Color System**: Professional blue primary, elegant purple secondary
- **Typography**: Inter font family, 10 size scales
- **Spacing**: 4px grid system, consistent spacing
- **Components**: 20+ reusable UI components with variants

### Component Library

```typescript
import { Button, Card, Input, Navigation } from '@/components/ui';

// Usage example
<Card variant="elevated">
  <Input label="Email" error="Required field" />
  <Button variant="primary" size="lg" loading>
    Submit
  </Button>
</Card>
```

### Responsive Design

- **Mobile First**: Optimized for touch interfaces
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px)
- **Grid System**: Flexible CSS Grid and Flexbox utilities
- **Touch Friendly**: 44px minimum touch targets

### Accessibility Features

- **WCAG 2.1 AA**: Fully compliant with accessibility standards
- **Keyboard Navigation**: Complete keyboard support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and focus traps
- **Color Contrast**: 4.5:1 minimum contrast ratio

### PWA Capabilities

- **Offline Support**: Core functionality works offline
- **App Installation**: Native app experience
- **Background Sync**: Data sync when connection restored
- **Push Notifications**: Real-time updates (optional)

### Performance Optimization

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Code Splitting**: Route and component level splitting
- **Image Optimization**: WebP format and responsive images
- **Caching Strategy**: Smart caching with Service Worker

View all components: [http://localhost:3000/components](http://localhost:3000/components)

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm migrate` - Run database migrations
- `pnpm db:health` - Check database connection

## 🗄️ Database Management

### Running Migrations

```bash
# Run all pending migrations
pnpm migrate

# List applied migrations
pnpm migrate list

# Rollback specific migration
pnpm migrate rollback <migration_id>
```

### Database Schema

The application uses the following main tables:

- `users` - User accounts and profiles
- `user_sessions` - Authentication sessions
- `cover_letters` - Generated cover letters and metadata
- `migrations` - Migration tracking

## 🤖 AI Configuration

### OpenRouter Models

The application supports multiple AI models through OpenRouter:

- **GPT-4o** - High quality, balanced performance
- **GPT-4o Mini** - Fast and cost-effective (default)
- **Claude 3.5 Sonnet** - Excellent for creative writing
- **Llama 3.1** - Open source alternative

### Model Selection

Models are automatically selected based on use case:

- **Cover Letter Generation**: GPT-4o Mini (balance of quality and cost)
- **Content Analysis**: GPT-4o (high-quality analysis)
- **Quick Responses**: GPT-3.5 Turbo (fast and affordable)

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui
```

### End-to-End Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Install Playwright browsers (first time only)
npx playwright install
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Automatic deployment on push to main branch**

### Production Environment Variables

```env
OPENROUTER_API_KEY=your_production_api_key
NEON_DATABASE_URL=your_production_database_url
NEON_DATABASE_URL_UNPOOLED=your_production_unpooled_url
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://yourdomain.com
```

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📊 Performance

- **Core Web Vitals**: Optimized for LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size**: Automatic code splitting and tree shaking
- **Images**: Next.js Image component with AVIF/WebP support
- **Caching**: Static generation for marketing pages, ISR for dynamic content

## 🔒 Security

- **Authentication**: JWT-based sessions with secure httpOnly cookies
- **Database**: Neon row-level security
- **API**: Rate limiting and input validation
- **Headers**: Security headers and CSP
- **Environment**: Secure environment variable handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use Prettier for code formatting
- Write tests for new features
- Follow conventional commit messages
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [development.md](development.md) file
- **Issues**: Report bugs and feature requests on GitHub
- **Discussions**: Join community discussions

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [OpenRouter](https://openrouter.ai/) - AI model access
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Vercel](https://vercel.com/) - Deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
