# Deployment Guide

This guide covers how to deploy the Cover Letter Generator to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. **OpenRouter API Key** - Register at [OpenRouter](https://openrouter.ai/)
2. **Neon Database** - Create database at [Neon](https://neon.tech/)
3. **Domain Name** (for production) - Optional but recommended

## Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments and edge functions.

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select repository and click "Import"

### 2. Configure Environment Variables

In the Vercel dashboard, add the following environment variables:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEON_DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/neondb
NEON_DATABASE_URL_UNPOOLED=postgresql://username:password@ep-xxx.neon.tech/neondb?pgbouncer=false
NEXTAUTH_SECRET=your_secure_random_string
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 3. Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be available at `https://your-project.vercel.app`

### 4. Run Database Migrations

After deployment, run migrations using Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Run migrations
vercel env pull .env.local
pnpm migrate
```

### 5. Custom Domain (Optional)

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add custom domain
4. Update `NEXTAUTH_URL` environment variable

## Railway Deployment

Railway provides a simple deployment experience with built-in PostgreSQL database.

### 1. Setup Railway

1. Go to [Railway](https://railway.app/)
2. Connect your GitHub account
3. Create new project from repository

### 2. Add PostgreSQL

1. Click "New" → "Database" → "PostgreSQL"
2. Note connection details

### 3. Configure Environment Variables

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEON_DATABASE_URL=postgresql://postgres:password@host:port/database
NEXTAUTH_SECRET=your_secure_random_string
NEXTAUTH_URL=https://your-app.railway.app
```

### 4. Deploy

Railway will automatically deploy when you push to the main branch.

## Docker Deployment

Suitable for self-hosting or custom infrastructure.

### 1. Create Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Build and Run

```bash
# Build image
docker build -t cover-letter-generator .

# Run container
docker run -p 3000:3000 \
  -e OPENROUTER_API_KEY=your_key \
  -e NEON_DATABASE_URL=your_db_url \
  -e NEXTAUTH_SECRET=your_secret \
  cover-letter-generator
```

### 3. Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - NEON_DATABASE_URL=${NEON_DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=coverletters
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

volumes:
  postgres_data:
```

## AWS Deployment

Deploy using various AWS services.

### Option 1: AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Connect your repository
3. Configure build settings
4. Add environment variables
5. Deploy

### Option 2: AWS ECS with Fargate

1. Build and push Docker image to ECR
2. Create ECS cluster
3. Define task definition
4. Create service
5. Configure load balancer

### Option 3: AWS Lambda (Serverless)

Use Serverless Framework or AWS SAM for serverless deployment.

## Environment Variables Reference

### Required Variables

| Variable Name        | Description        | Example                          |
| -------------------- | ------------------ | -------------------------------- |
| `OPENROUTER_API_KEY` | OpenRouter API key | `sk-or-v1-...`                   |
| `NEON_DATABASE_URL`  | Neon database URL  | `postgresql://user:pass@host/db` |
| `NEXTAUTH_SECRET`    | JWT signing secret | `your-secret-key`                |
| `NEXTAUTH_URL`       | Application URL    | `https://yourdomain.com`         |

### Optional Variables

| Variable Name                | Description           | Default                     |
| ---------------------------- | --------------------- | --------------------------- |
| `NEON_DATABASE_URL_UNPOOLED` | Unpooled database URL | Same as `NEON_DATABASE_URL` |
| `NODE_ENV`                   | Environment mode      | `production`                |
| `PORT`                       | Server port           | `3000`                      |

## Database Setup

### 1. Create Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create new project
3. Note connection string
4. Create separate branch for testing (optional)

### 2. Run Migrations

```bash
# Set environment variable
export NEON_DATABASE_URL="your_connection_string"

# Run migrations
pnpm migrate
```

### 3. Verify Database

```bash
# Check database health
pnpm db:health
```

## Performance Optimization

### 1. Enable Caching

Configure cache headers in `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/health',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
};
```

### 2. Database Connection Pooling

Neon handles connection pooling automatically, but for other databases:

```typescript
// Configure connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 3. CDN Configuration

Configure CDN for static assets:

```javascript
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.yourdomain.com' : '',
};
```

## Monitoring and Logging

### 1. Vercel Analytics

Enable in `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Tracking

Configure Sentry or similar service:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Security Considerations

1. **Environment Variables**: Never commit secrets to version control
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Input Validation**: Validate all user inputs
5. **Database Security**: Use connection pooling and prepared statements

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version compatibility
2. **Database Connection**: Verify connection string format
3. **API Errors**: Check OpenRouter API key validity
4. **Memory Issues**: Increase memory limits for large deployments

### Debug Commands

```bash
# Check build locally
pnpm build

# Test production build
pnpm start

# Check database connection
pnpm db:health

# View logs (Vercel)
vercel logs
```
