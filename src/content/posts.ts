import type { Language } from './site'

export type PostKind = 'paper' | 'essay' | 'reading' | 'guide'

type Frontmatter = {
  title: string
  date: string
  category: string
  kind: PostKind
  excerpt: string
  research?: string
}

export type PostTranslation = Frontmatter & {
  body: string
  language: Language
}

export type Post = {
  slug: string
  date: string
  translations: Partial<Record<Language, PostTranslation>>
}

const files = import.meta.glob('./posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function parseMarkdown(source: string, path: string): { data: Frontmatter; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) throw new Error(`Missing frontmatter in ${path}`)

  const values: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator < 0) continue
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim().replace(/^(["'])(.*)\1$/, '$2')
    values[key] = value
  }

  for (const key of ['title', 'date', 'category', 'kind', 'excerpt']) {
    if (!values[key]) throw new Error(`Missing "${key}" in ${path}`)
  }
  if (!['paper', 'essay', 'reading', 'guide'].includes(values.kind)) {
    throw new Error(`Invalid "kind" in ${path}`)
  }

  return {
    data: {
      title: values.title,
      date: values.date,
      category: values.category,
      kind: values.kind as PostKind,
      excerpt: values.excerpt,
      research: values.research || undefined,
    },
    body: source.slice(match[0].length).trim(),
  }
}

function collectPosts(): Post[] {
  const posts = new Map<string, Post>()
  for (const [path, source] of Object.entries(files)) {
    const file = path.match(/\/([^/]+)\.(zh|en)\.md$/)
    if (!file) continue
    const [, slug, language] = file
    const { data, body } = parseMarkdown(source, path)
    const current = posts.get(slug) ?? { slug, date: data.date, translations: {} }
    current.date = current.date || data.date
    current.translations[language as Language] = {
      ...data,
      body,
      language: language as Language,
    }
    posts.set(slug, current)
  }
  return [...posts.values()].sort((a, b) => b.date.localeCompare(a.date))
}

export const posts = collectPosts()

export function getTranslation(post: Post, preferred: Language) {
  const language: Language = post.translations[preferred]
    ? preferred
    : preferred === 'zh'
      ? 'en'
      : 'zh'
  return {
    translation: post.translations[language],
    isFallback: language !== preferred,
  }
}
