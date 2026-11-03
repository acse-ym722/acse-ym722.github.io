---
title: Maintaining this personal homepage
date: 2026-11-03
category: Site guide
kind: guide
excerpt: Learn how to maintain research lines and bilingual articles on this static academic homepage.
---

This homepage keeps **personal information, research lines, and articles** separate. Routine maintenance mainly involves editing text and Markdown files—not rebuilding pages.

## Update your profile

Open `src/content/site.ts`. Your name, homepage introduction, about information, and GitHub link live here. Each entry has `zh` and `en` fields.

## Continue a research line

Open `src/content/research.ts`. Each line contains a core question, `stages` for milestones, `resources` for outputs, and `nextQuestions` for future directions.

After a paper is published, new experiments, code, data, and articles can remain attached to the same line instead of becoming isolated pages. A standalone interactive site connects through `interactive`.

## Add an article

Create two files in `src/content/posts/`:

- `my-article.zh.md` for the Chinese version
- `my-article.en.md` for the English version

Use the same base filename so both versions share one article link. Add the title, date, category, kind, and excerpt at the top, then write in Markdown.

The `kind` field supports `paper` for paper explanations, `essay` for personal essays, `reading` for reading notes, and `guide` for technical guides. The optional `research` field connects an article to a research line, for example `research: super-resolution`.

## One language is enough

If only one version is available, add just that file. When a visitor switches languages, the available version appears with a short notice.

## Publish a private tutorial

Keep private drafts in the separate private repository. When a tutorial is ready, copy only the selected article and necessary attachments into this public site and mark it as `guide`; do not publish the entire draft library.

## Keep the structure simple

New articles and research lines appear without navigation changes. Start with writing and organizing; add features only when a genuine content need emerges.
