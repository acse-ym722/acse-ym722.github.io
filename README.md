# 孟洋的个人学术主页

中英双语静态学术主页，公开地址为 **https://acse-ym722.github.io/**。网站以研究主线组织论文、代码、数据、阶段进展与后续问题，以 Markdown 管理文章，并支持按需加载的独立交互案例。

## 内容结构

```text
src/
├── AcademicSite.tsx          全站路由、页面与双语交互
├── main.tsx                 应用入口（BrowserRouter 只在这里出现）
├── homepage.css             主页、研究、写作与关于页样式
├── content/
│   ├── site.ts              姓名、首页介绍、关于信息与通用文案
│   ├── research.ts          研究主线、阶段、资源与后续问题
│   ├── posts.ts             Markdown 自动索引与语言回退
│   └── posts/               中英双语文章
└── cases/
    └── poreboost/           独立的超分交互案例
        ├── PoreBoostCase.tsx
        ├── ResearchUI.tsx
        ├── case.css
        └── assets/          案例图像模块
```

## 修改个人信息

编辑 `src/content/site.ts`：

- `name`、`role`：姓名与主页身份。
- `heroTitle`、`heroDescription`、`availability`：首页介绍。
- `aboutParagraphs`、`details`：关于页内容。
- `github`：GitHub 个人主页。
- `ui`：通用界面文案。

每项公开内容均有 `zh` 与 `en` 字段。Google Scholar 与 ORCID 只应在确认本人链接后添加，避免误连同名研究者。

## 维护研究主线

编辑 `src/content/research.ts`。每条主线包含：

- `slug`：稳定且唯一的 URL 标识。
- `title`、`shortTitle`、`summary`、`question`：研究问题与概述。
- `keywords`：研究关键词。
- `stages`：连续研究路径，可不断追加新阶段。
- `resources`：论文、代码、数据等成果入口。
- `nextQuestions`：论文发表后仍值得推进的问题。
- `interactive`：可选的独立案例入口。

新主线加入 `researchLines` 后，会自动出现在首页和研究索引中，地址为 `/research/你的-slug`，不需要新增索引页面。

如果文章属于某条研究主线，可在文章 Frontmatter 中设置相同的 `research` 值，文章页与研究主线就会互相建立内容关联。

## 新增文章

在 `src/content/posts/` 中添加：

```text
my-article.zh.md
my-article.en.md
```

两个文件使用相同的基础文件名，共享 `/writing/my-article`。只提供一种语言也可以，切换语言时会显示已有版本并提示读者。

```markdown
---
title: 文章标题
date: 2026-11-03
category: 自定义栏目
kind: paper
excerpt: 一句话摘要。
research: super-resolution
---

正文从这里开始。
```

`kind` 必须从以下四类中选择：

- `paper`：已发表论文或其他论文的解读。
- `essay`：个人随笔。
- `reading`：有趣文章与资料的阅读笔记。
- `guide`：选择公开的技术教程。

`research` 是可选项，不需要关联研究主线时可省略。文章按日期自动排序，不需要手动修改列表。

## 私有教程与选择性开源

私有原稿继续保存在独立私有仓库 `acse-ym722/technical-notes`，不要放入本公开仓库。

公开某篇教程时，只复制最终选中的 Markdown 与必要附件到本仓库，并设置 `kind: guide`。不要公开整个私有仓库，也不要把私有草稿、未审阅附件或访问凭据带入公开历史。

## 新增独立案例

1. 在 `src/cases/` 下建立独立目录，案例组件与样式尽量只作用于该目录。
2. 在 `AcademicSite.tsx` 中使用 `React.lazy` 与 `Suspense` 注册独立路由。
3. 在对应研究主线的 `interactive` 中填写案例地址。
4. 验证案例内部锚点、返回研究主线、手机布局和全部交互。

超分案例地址为 `/research/super-resolution/interactive`。它只在访客进入时加载，不影响首页初始体积。

## 本地运行与检查

```bash
npm install
npm run dev
```

开发地址为 `http://localhost:3000`。

```bash
npm run build
```

构建输出在 `dist/`。发布前应至少检查：首页、研究主线、文章筛选、中英文切换、独立案例和手机端。

## GitHub Pages 发布

仓库为 `acse-ym722/acse-ym722.github.io`，主分支为 `main`。

`.github/workflows/deploy.yml` 会在推送到 `main` 后自动安装依赖、构建并部署 `dist/`。日常只提交源文件，不需要提交 `dist/`。

`public/404.html` 与 `index.html` 中的恢复脚本用于 GitHub Pages 的 SPA 回退，使访客可以直接打开研究和文章的干净 URL。案例内部 `#overview` 等锚点不会与全站路由冲突。

网站没有数据库。语言偏好只保存在当前浏览器；公开内容全部由本仓库文件管理。
