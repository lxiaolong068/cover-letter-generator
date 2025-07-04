# 求职信生成器

基于 Next.js 15、OpenRouter API 和 Neon Database 构建的 AI 求职信生成器。在几秒钟内创建定制化、ATS 优化的求职信。

## ✨ 特性

- 🤖 **AI 驱动生成**: 使用 OpenRouter API，支持多种模型选择（GPT-4、Claude、Llama 等）
- 📄 **多种模板**: 专业、创意、技术和高管求职信样式
- 🎯 **ATS 优化**: 针对申请人跟踪系统的关键词优化
- 💾 **保存和导出**: 保存求职信并导出为 PDF 格式
- 🔒 **安全**: 内置身份验证和会话管理
- ⚡ **快速**: 无服务器架构和边缘函数
- 📱 **响应式**: 移动优先设计，现代 UI 组件
- 🎨 **现代设计**: 受 Material Design 3.0 启发的界面
- ♿ **无障碍**: 符合 WCAG 2.1 AA 标准，支持完整键盘导航
- 🌐 **PWA 就绪**: 可安装应用，支持离线使用
- 🔍 **SEO 优化**: 结构化数据和元标签，提升搜索可见性

## 🛠️ 技术栈

- **前端**: Next.js 15 (App Router), React 19, TypeScript
- **样式**: Tailwind CSS 4.0, 自定义设计系统
- **UI 组件**: 使用 CVA (Class Variance Authority) 的自定义组件库
- **AI**: OpenRouter API 配合 Vercel AI SDK
- **数据库**: Neon PostgreSQL (无服务器)
- **身份验证**: 自定义 JWT 认证
- **PWA**: Service Worker, Web App Manifest
- **SEO**: 结构化数据，元标签优化
- **无障碍**: WCAG 2.1 AA 合规
- **测试**: Vitest, Playwright, React Testing Library
- **部署**: Vercel

## 🚀 快速开始

### 前置条件

- Node.js 20+
- pnpm (推荐)
- OpenRouter API 密钥
- Neon 数据库

### 安装步骤

1. **克隆仓库**

   ```bash
   git clone <repository-url>
   cd cover-letter-generator
   ```

2. **安装依赖**

   ```bash
   pnpm install
   ```

3. **设置环境变量**

   ```bash
   cp .env.example .env.local
   ```

   填写您的环境变量：

   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key
   NEON_DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/neondb
   NEON_DATABASE_URL_UNPOOLED=postgresql://username:password@ep-xxx.neon.tech/neondb?pgbouncer=false
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **运行数据库迁移**

   ```bash
   pnpm migrate
   ```

5. **启动开发服务器**

   ```bash
   pnpm dev
   ```

6. **打开浏览器**
   访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # 公开页面 (SSG)
│   ├── dashboard/         # 受保护页面 (SSR)
│   ├── components/        # 组件展示页面
│   ├── offline/           # PWA 离线页面
│   └── api/               # API 路由 (边缘函数)
├── components/            # 可复用 UI 组件
│   ├── ui/                # 核心 UI 组件
│   ├── seo/               # SEO 组件
│   ├── accessibility/     # 无障碍组件
│   └── pwa/               # PWA 组件
├── lib/                   # 工具函数
│   ├── openrouter.ts     # OpenRouter API 配置
│   ├── neon.ts           # Neon 数据库工具
│   ├── ai.ts             # AI 生成函数
│   └── utils.ts          # 通用工具
├── styles/               # 全局样式和设计令牌
├── content/              # MDX 博客文章
└── test/                 # 测试设置和工具

scripts/
└── migrate.ts            # 数据库迁移脚本

public/                   # 静态资源
├── manifest.json         # PWA 清单
├── sw.js                 # Service Worker
└── icons/                # 应用图标
```

## 🎨 前端设计系统

### 现代 UI 组件

我们的设计系统基于 Material Design 3.0 原则构建：

- **色彩系统**: 专业的蓝色主色调，优雅的紫色辅助色
- **排版**: Inter 字体族，10 个尺寸等级
- **间距**: 4px 网格系统，一致的间距
- **组件**: 20+ 个可复用的 UI 组件及其变体

### 组件库

```typescript
import { Button, Card, Input, Navigation } from '@/components/ui';

// 使用示例
<Card variant="elevated">
  <Input label="Email" error="Required field" />
  <Button variant="primary" size="lg" loading>
    Submit
  </Button>
</Card>
```

### 响应式设计

- **移动优先**: 为触摸界面优化
- **断点**: sm(640px), md(768px), lg(1024px), xl(1280px)
- **网格系统**: 灵活的 CSS Grid 和 Flexbox 工具
- **触摸友好**: 44px 最小触摸目标

### 无障碍特性

- **WCAG 2.1 AA**: 完全符合无障碍标准
- **键盘导航**: 完整的键盘支持
- **屏幕阅读器**: 适当的 ARIA 标签和语义化 HTML
- **焦点管理**: 可见的焦点指示器和焦点陷阱
- **色彩对比**: 4.5:1 最小对比度

### PWA 能力

- **离线支持**: 核心功能支持离线使用
- **应用安装**: 原生应用体验
- **后台同步**: 连接恢复时数据同步
- **推送通知**: 实时更新（可选）

### 性能优化

- **核心 Web 指标**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **代码分割**: 路由和组件级别分割
- **图像优化**: WebP 格式和响应式图像
- **缓存策略**: 使用 Service Worker 的智能缓存

查看所有组件：[http://localhost:3000/components](http://localhost:3000/components)

## 🔧 可用脚本

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm start` - 启动生产服务器
- `pnpm lint` - 运行 ESLint
- `pnpm type-check` - 运行 TypeScript 类型检查
- `pnpm format` - 使用 Prettier 格式化代码
- `pnpm test` - 运行单元测试
- `pnpm test:e2e` - 运行端到端测试
- `pnpm migrate` - 运行数据库迁移
- `pnpm db:health` - 检查数据库连接

## 🗄️ 数据库管理

### 运行迁移

```bash
# 运行所有待处理迁移
pnpm migrate

# 列出已应用的迁移
pnpm migrate list

# 回滚特定迁移
pnpm migrate rollback <migration_id>
```

### 数据库架构

应用程序使用以下主要表：

- `users` - 用户账户和个人资料
- `user_sessions` - 身份验证会话
- `cover_letters` - 生成的求职信和元数据
- `migrations` - 迁移跟踪

## 🤖 AI 配置

### OpenRouter 模型

应用程序通过 OpenRouter 支持多种 AI 模型：

- **GPT-4o** - 高质量，性能均衡
- **GPT-4o Mini** - 快速且成本效益（默认）
- **Claude 3.5 Sonnet** - 擅长创意写作
- **Llama 3.1** - 开源替代方案

### 模型选择

模型根据使用场景自动选择：

- **求职信生成**: GPT-4o Mini（质量和成本的平衡）
- **内容分析**: GPT-4o（分析高质量）
- **快速响应**: GPT-3.5 Turbo（快速且价格优惠）

## 🧪 测试

### 单元测试

```bash
# 运行所有单元测试
pnpm test

# 在监视模式下运行测试
pnpm test --watch

# 使用 UI 运行测试
pnpm test:ui
```

### 端到端测试

```bash
# 运行 E2E 测试
pnpm test:e2e

# 使用 UI 运行 E2E 测试
pnpm test:e2e:ui

# 安装 Playwright 浏览器（仅首次）
npx playwright install
```

## 🚀 部署

### Vercel（推荐）

1. **将您的仓库连接到 Vercel**
2. **在 Vercel 控制台中设置环境变量**
3. **推送到主分支时自动部署**

### 生产环境变量

```env
OPENROUTER_API_KEY=your_production_api_key
NEON_DATABASE_URL=your_production_database_url
NEON_DATABASE_URL_UNPOOLED=your_production_unpooled_url
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://yourdomain.com
```

### 手动部署

```bash
# 构建应用程序
pnpm build

# 启动生产服务器
pnpm start
```

## 📊 性能

- **核心 Web 指标**: 优化为 LCP < 2.5s, FID < 100ms, CLS < 0.1
- **包大小**: 自动代码分割和 tree shaking
- **图像**: Next.js Image 组件，支持 AVIF/WebP
- **缓存**: 营销页面静态生成，动态内容 ISR

## 🔒 安全

- **身份验证**: 基于 JWT 的会话，安全的 httpOnly cookies
- **数据库**: Neon 行级安全
- **API**: 限率控制和输入验证
- **头部**: 安全头部和 CSP
- **环境**: 安全的环境变量处理

## 🤝 贡献

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### 开发指南

- 遵循 TypeScript 严格模式
- 使用 Prettier 进行代码格式化
- 为新功能编写测试
- 遵循约定式提交消息
- 根据需要更新文档

## 📝 许可证

该项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

- **文档**: 查看 [development.md](development.md) 文件
- **问题**: 在 GitHub 上报告 bug 和功能请求
- **讨论**: 参与社区讨论

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [OpenRouter](https://openrouter.ai/) - AI 模型访问
- [Neon](https://neon.tech/) - 无服务器 PostgreSQL
- [Vercel](https://vercel.com/) - 部署平台
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架

```

```
