# 部署指南

本指南介绍如何将求职信生成器部署到各种平台。

## 前置条件

在部署之前，请确保您拥有：

1. **OpenRouter API 密钥** - 在 [OpenRouter](https://openrouter.ai/) 注册
2. **Neon 数据库** - 在 [Neon](https://neon.tech/) 创建数据库
3. **域名**（用于生产环境）- 可选但建议使用

## Vercel 部署（推荐）

Vercel 为 Next.js 应用程序提供最佳体验，支持自动部署和边缘函数。

### 1. 连接仓库

1. 前往 [Vercel 控制台](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入您的 GitHub 仓库
4. 选择仓库并点击 "Import"

### 2. 配置环境变量

在 Vercel 控制台中，添加以下环境变量：

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEON_DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/neondb
NEON_DATABASE_URL_UNPOOLED=postgresql://username:password@ep-xxx.neon.tech/neondb?pgbouncer=false
NEXTAUTH_SECRET=your_secure_random_string
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 3. 部署

1. 点击 "Deploy"
2. 等待构建完成
3. 您的应用将在 `https://your-project.vercel.app` 上可用

### 4. 运行数据库迁移

部署后，使用 Vercel CLI 运行迁移：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录到 Vercel
vercel login

# 链接项目
vercel link

# 运行迁移
vercel env pull .env.local
pnpm migrate
```

### 5. 自定义域名（可选）

1. 前往 Vercel 项目设置
2. 导航到 "Domains"
3. 添加自定义域名
4. 更新 `NEXTAUTH_URL` 环境变量

## Railway 部署

Railway 提供简单的部署体验，内置 PostgreSQL 数据库。

### 1. 设置 Railway

1. 前往 [Railway](https://railway.app/)
2. 连接您的 GitHub 账户
3. 从仓库创建新项目

### 2. 添加 PostgreSQL

1. 点击 "New" → "Database" → "PostgreSQL"
2. 记录连接详情

### 3. 配置环境变量

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEON_DATABASE_URL=postgresql://postgres:password@host:port/database
NEXTAUTH_SECRET=your_secure_random_string
NEXTAUTH_URL=https://your-app.railway.app
```

### 4. 部署

当您推送到主分支时，Railway 将自动部署。

## Docker 部署

适用于自托管或自定义基础设施。

### 1. 创建 Dockerfile

```dockerfile
FROM node:20-alpine AS base

# 仅在需要时安装依赖
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# 仅在需要时重新构建源代码
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm run build

# 生产镜像，复制所有文件并运行 next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# 为预渲染缓存设置正确权限
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

### 2. 构建和运行

```bash
# 构建镜像
docker build -t cover-letter-generator .

# 运行容器
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

## AWS 部署

使用各种 AWS 服务进行部署。

### 选项 1: AWS Amplify

1. 前往 [AWS Amplify 控制台](https://console.aws.amazon.com/amplify/)
2. 连接您的仓库
3. 配置构建设置
4. 添加环境变量
5. 部署

### 选项 2: AWS ECS 配合 Fargate

1. 构建并推送 Docker 镜像到 ECR
2. 创建 ECS 集群
3. 定义任务定义
4. 创建服务
5. 配置负载均衡器

### 选项 3: AWS Lambda（无服务器）

使用 Serverless Framework 或 AWS SAM 进行无服务器部署。

## 环境变量参考

### 必需变量

| 变量名               | 描述                  | 示例                             |
| -------------------- | --------------------- | -------------------------------- |
| `OPENROUTER_API_KEY` | OpenRouter API 密钥   | `sk-or-v1-...`                   |
| `NEON_DATABASE_URL`  | Neon 数据库连接字符串 | `postgresql://user:pass@host/db` |
| `NEXTAUTH_SECRET`    | JWT 签名密钥          | `your-secret-key`                |
| `NEXTAUTH_URL`       | 应用程序 URL          | `https://yourdomain.com`         |

### 可选变量

| 变量名                       | 描述             | 默认值                      |
| ---------------------------- | ---------------- | --------------------------- |
| `NEON_DATABASE_URL_UNPOOLED` | 非池化数据库连接 | 与 `NEON_DATABASE_URL` 相同 |
| `NODE_ENV`                   | 环境模式         | `production`                |
| `PORT`                       | 服务器端口       | `3000`                      |

## 数据库设置

### 1. 创建 Neon 数据库

1. 前往 [Neon 控制台](https://console.neon.tech/)
2. 创建新项目
3. 记录连接字符串
4. 为测试环境创建单独分支（可选）

### 2. 运行迁移

```bash
# 设置环境变量
export NEON_DATABASE_URL="your_connection_string"

# 运行迁移
pnpm migrate
```

### 3. 验证数据库

```bash
# 检查数据库健康状态
pnpm db:health
```

## 性能优化

### 1. 启用缓存

在 `next.config.js` 中配置缓存头：

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

### 2. 数据库连接池

Neon 自动处理连接池，但对于其他数据库：

```typescript
// 配置连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 3. CDN 配置

为静态资源配置 CDN：

```javascript
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.yourdomain.com' : '',
};
```

## 监控和日志

### 1. Vercel 分析

在 `app/layout.tsx` 中启用：

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

### 2. 错误跟踪

配置 Sentry 或类似服务：

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 安全考虑

1. **环境变量**: 不要将密钥提交到版本控制系统
2. **HTTPS**: 生产环境中始终使用 HTTPS
3. **限率控制**: 为 API 端点实施限率控制
4. **输入验证**: 验证所有用户输入
5. **数据库安全**: 使用连接池和预编译语句

## 故障排除

### 常见问题

1. **构建失败**: 检查 Node.js 版本兼容性
2. **数据库连接**: 验证连接字符串格式
3. **API 错误**: 检查 OpenRouter API 密钥有效性
4. **内存问题**: 为大型部署增加内存限制

### 调试命令

```bash
# 本地检查构建
pnpm build

# 测试生产构建
pnpm start

# 检查数据库连接
pnpm db:health

# 查看日志 (Vercel)
vercel logs
```
