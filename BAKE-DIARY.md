# BakeDiary 烘焙日记模块

## 概述

BakeDiary 是 UKORII 个人网站中的烘焙作品展示模块，采用 Astro Content Collections 管理内容，整体视觉为可爱马卡龙风格。

## 目录结构

```
src/
├── content.config.ts          # Content Collection Schema + glob loader
│   └── bake-diary/            # 烘焙日记 Markdown 条目（src/content/bake-diary/）
│       ├── strawberry-cake.md
│       └── ...
├── components/
│   ├── BakeDiary.astro        # 主区块（画廊 + 筛选）
│   └── BakeCard.astro         # 单条卡片组件
├── pages/
│   └── bake-diary/
│       ├── index.astro        # 完整列表页 /bake-diary
│       └── [slug].astro       # 详情页 /bake-diary/:slug
├── styles/
│   └── bake-diary.css         # 可爱风格样式
└── scripts/
    └── bake-diary.js          # 筛选与交互逻辑

public/bake/                   # 烘焙作品图片（SVG 占位）
```

## 数据结构

每条烘焙日记 Markdown 文件的 frontmatter 字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 标题 |
| `date` | date | ✅ | 发布日期 |
| `mainImage` | string | ✅ | 主图 URL（放 `public/bake/`） |
| `description` | string | ✅ | 简短心得 |
| `tags` | string[] | ✅ | 标签/分类 |
| `featured` | boolean | ❌ | 是否精选（默认 false） |
| 正文 | markdown | ❌ | 详细食谱（`## 材料`、`## 制作过程` 等） |

## 添加新条目

1. 在 `public/bake/` 放入图片（推荐 WebP，宽度 ≤ 800px）
2. 在 `src/content/bake-diary/` 新建 `.md` 文件
3. 填写 frontmatter 和正文，保存后 dev 服务器自动热更新

## 开发命令

```bash
cd .astro
npm run dev      # 本地开发 http://localhost:4321
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

## 功能特性

- **图片画廊**：响应式网格布局，圆角卡片 + 悬停动画
- **标签筛选**：顶部导航按钮，支持键盘左右键切换
- **懒加载**：`loading="lazy"` + Intersection Observer 渐入
- **详情页**：Markdown 渲染完整食谱
- **无障碍**：语义 HTML、aria 属性、`:focus-visible`、减少动画偏好支持

## 视觉风格

- **色彩**：马卡龙粉 `#FFB5C2`、天蓝 `#B5E8FF`、柠檬 `#FFF5B5`、薄荷 `#C5FFB5`
- **字体**：Nunito（Google Fonts）+ 系统中文字体
- **元素**：大圆角、柔和阴影、emoji 装饰、弹性 hover 动画
