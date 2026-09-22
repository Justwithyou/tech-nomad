# Tech-Nomad

深色星空主题的个人技术博客，基于 [Astro](https://astro.build/) 构建，内容以 Markdown 编写，支持代码高亮、目录大纲、标签云等功能，适合部署到 GitHub Pages。

## 技术栈

- [Astro](https://astro.build/) 4.x — 静态站点框架
- 原生 HTML / CSS / JS，无额外 UI 框架
- Markdown + Shiki 代码高亮（`github-dark` 主题）
- 深色星空背景 + 毛玻璃（`backdrop-filter: blur`）卡片风格

## 功能特性

- 首页：Hero 区 + status 终端卡片 + 最新文章列表 + 项目卡片 + 标签云
- 博客：文章列表与详情页，自动生成目录大纲（TOC）并随滚动高亮定位
- 文章详情页：悬浮「回到顶部」按钮、上一篇/下一篇导航、分享与复制链接
- 关于页（About）与项目页（Projects）
- 响应式布局，桌面端基础字号 19px、移动端 16px

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 本地访问 http://localhost:4321/Tech-Nomad/

# 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

## 目录结构

```
Tech-Nomad/
├── src/
│   ├── components/        # 可复用组件（Nav、TOC、PostCard、Terminal 等）
│   ├── content/
│   │   ├── config.ts      # 内容集合 schema 定义
│   │   └── blog/          # 博客文章（Markdown）
│   ├── layouts/           # 布局（Base、Home、BlogPost）
│   ├── pages/             # 页面路由（index、blog、about、projects）
│   └── styles/            # 全局样式与 CSS 变量
├── astro.config.mjs       # 站点配置（base 路径、代码高亮）
└── package.json
```

## 编写文章

文章放在 `src/content/blog/` 下，文件名为 URL slug。可复制 `_template.md` 作为模板（该文件本身不会作为文章发布）。

Frontmatter 字段：

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题 |
| `description` | 是 | 一句话简介，用于列表页与 SEO |
| `published` | 是 | 发布日期（`YYYY-MM-DD`） |
| `tags` | 否 | 标签数组 |
| `draft` | 否 | 草稿，`true` 时不出现在列表中 |
| `accent` | 否 | 强调色：`cyan` / `indigo` / `purple` |
| `author` / `authorInitials` / `authorRole` | 否 | 作者信息 |

支持的 Markdown 元素：标题、粗体/斜体、行内代码、链接、列表、引用块、代码块（语法高亮）、表格等。

## 部署

默认 `base` 配置为 `/Tech-Nomad/`（对应 GitHub Pages 项目站点）。部署前请在 `astro.config.mjs` 中把 `site` 改为你的站点地址：

```js
site: 'https://yourusername.github.io',
```

构建后把 `dist/` 目录的内容部署到目标仓库即可。