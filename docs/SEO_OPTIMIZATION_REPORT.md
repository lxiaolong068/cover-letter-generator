# Cover Letter Generator – SEO 优化报告

> 关键词聚焦：**AI Cover Letter Generator**
> 目标语言：**英语**
> 更新时间：2025-07-27

---

## 1. Current SEO Analysis

### 1.1 Meta & Open Graph 实现

- 全局 `src/app/layout.tsx` 使用了 Next.js 13 的新 `Metadata` API：
  - `title`, `description`, `openGraph`, `twitter`, `robots` 均已配置。
  - 关键词缺失（`keywords` meta 未设置）。
  - Canonical 仅在首页设置，侧页依赖 `seo.ts` 动态生成，但页面组件需显式调用。
- 组件层面存在 `SEOHead`（`src/components/seo/SEOHead.tsx`）：
  - 支持自定义 canonical、og:image、Twitter Card、alternate language 等。
  - 目前各营销页面 (**/templates**, **/pricing** 等) 未统一使用 `SEOHead`，导致部分 meta 重复或缺漏。

### 1.2 结构化数据

- `StructuredData.tsx` 提供 `Website`, `Organization`, `SoftwareApplication`, `Breadcrumb`, `FAQ`, `HowTo` JSON-LD 生成器。
- 仅在少数页面（如首页）使用，其他核心转换页尚未嵌入。

### 1.3 Header 层级

- 主页与仪表盘子页面大多只含一个 `<h1>`，符合最佳实践，但部分营销页 (e.g. **/pricing**) 直接使用 `<h2>` 开头。

### 1.4 URL & Routing

- Next 13 App Router 路径扁平、可读，符合 REST 思想。
- 动态路由 `/api/cover-letters/[id]` 暴露数据库 ID，可考虑 slug 化提升可读性与 CTR。

### 1.5 性能 / Core Web Vitals

- 启用 `next/image` 与 WebP (`next.config.ts`) ✅
- `optimizeCss` 已打开，但仍包含 ≈250 KB 未压缩 Tailwind 输出。
- CLS 可能受 `<HeaderNavigation>` 动态注入影响。

---

## 2. Technical SEO Recommendations

| 优先级 | 项目              | 建议                          | 代码示例 |
| ------ | ----------------- | ----------------------------- | -------- |
| P0     | **Keywords meta** | 为所有页面动态注入 `keywords` | ```tsx   |

<meta name="keywords" content="AI Cover Letter Generator, cover letter templates, ATS optimized" />
``` |
| P0 | **Canonical 链接** | 在 `generate`, `templates`, `pricing` 等页面调用 `SEOHead`，传入 `canonical` props，避免重复内容 | `canonical="/templates"` |
| P0 | **唯一 Title / Description** | 确保每页 `page.tsx` 使用 `generateMetadata()`，删除硬编码 `<title>` |  |
| P1 | **Header 语义** | 营销页首个标题确保 `<h1>`；子标题依次 `<h2>` → `<h3>` |  |
| P1 | **URL slug** | 将 `/cover-letters/[id]` 改为 `/cover-letters/[slug]`；在生成器逻辑中存储 slug |  |
| P1 | **结构化数据** | 为模板页添加 `FAQStructuredData`, 为生成页添加 `HowToStructuredData` |  |
| P1 | **BreadCrumb** | 在多级路径 (`/dashboard/history`) 注入 `BreadcrumbStructuredData` |  |
| P2 | **Core Web Vitals** | - 打开 [next/font] 自带的 font-display: optional <br/>- 使用 `next/dynamic` 懒加载非首屏组件 <br/>- 优化 Tailwind：启用 `@layer` + purge >  |
| P2 | **Preload 关键资源** | 在 `_app`/layout 中使用 `<link rel="preload" ... as="image">` 对 hero 图进行预加载 |  |

---

## 3. Content SEO Strategy

1. **关键词布局**
   - 目标关键词出现于：`<title>`, `<h1>`, 首段 100 词内，结尾段。
   - 建议密度 ~1.0 %–1.5 %（约每 100 词 1 次）。
2. **语义与可读性**
   - 段落 ≤ 120 词，使用有序/无序列表拆分功能点。
   - 在 `<h2>` 中嵌入次级长尾关键词，如 “AI cover letter templates”.
3. **内部链接**
   - 利用 `InternalLinks` 组件在主体末尾输出相关链接；确保 anchor 文本包含关键词 (`AI cover letter examples`).
4. **图片 Alt 文本**
   - `OptimizedImage` 当前默认 `alt=""`，请改为必填 props；为关键插图编写含关键词描述，如 `alt="Dashboard of AI Cover Letter Generator showing generated letter"`.

---

## 4. Accessibility & SEO Alignment

| 范畴      | 问题 / 风险                                         | 建议                                                        |
| --------- | --------------------------------------------------- | ----------------------------------------------------------- |
| WCAG 2.1  | 缺少 `aria-live` 区域提示生成进度                   | 在生成器页添加 `<div aria-live="polite">` 可改善 A11y & SEO |
| 语义 HTML | 一些按钮使用 `<div role="button">`                  | 改为真正 `<button>`，搜索引擎更好解析交互                   |
| 移动适配  | 已配置 viewport ✅，但 dashboard 表格在 320 px 溢出 | 为列启用 `overflow-x-auto`                                  |

---

## 5. Implementation Roadmap

### 5.1 高优 (本周)

1. **抽象 `SEOHead`** 至所有营销路由
2. **新增 `keywords` meta** (参考表 2)
3. **确保唯一 `<h1>`**：修复 `/pricing`, `/templates`。
4. **Image Alt 必填**：重构 `OptimizedImage` 组件 props.

### 5.2 中优 (2 周内)

1. 路径 slug 化 (`/cover-letters/[slug]`) 并 301 重定向旧 URL
2. 添加 `FAQStructuredData` & `BreadcrumbStructuredData`
3. Tailwind JIT purge + `next/dynamic` 懒加载非关键组件

### 5.3 低优 (4-6 周)

1. 引入 Lighthouse CI，监控 Core Web Vitals
2. 实现文章/博客功能以拓展长尾流量

### 5.4 预估影响与时间线

| 时间  | 预期指标             | 影响                      |
| ----- | -------------------- | ------------------------- |
| +2 周 | 搜索展现量 ↑ 15 %    | keywords & canonical 修复 |
| +4 周 | 点击率 ↑ 8 %         | slug 优化 + 结构化数据    |
| +6 周 | 核心 Web Vitals 全绿 | 性能 + CLS 修复           |

---

## 6. 附录：代码片段

### 6.1 `OptimizedImage` 强制 alt

```tsx
// src/components/ui/OptimizedImage.tsx
export interface OptimizedImageProps {
  src: string;
  alt: string; // 👈 不再可选
  width: number;
  height: number;
  className?: string;
}
```

### 6.2 Page 级 Metadata 示例

```tsx
// src/app/(marketing)/pricing/page.tsx
import { generateMetadata } from '@/lib/seo';
export const metadata = generateMetadata('pricing');
```

### 6.3 添加结构化 FAQ

```tsx
import { FAQStructuredData } from '@/components/seo/StructuredData';

<FAQStructuredData
  faqs={[
    {
      question: 'Is the AI Cover Letter Generator free?',
      answer: 'Yes, a free tier is available ...',
    },
    // ...
  ]}
/>;
```

---

> **Next step**：按 5.1 中的任务创建对应 PR，并在 Vercel 预览环境进行 Lighthouse 复测。
