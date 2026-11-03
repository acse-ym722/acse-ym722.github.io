import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useOutletContext,
  useParams,
} from 'react-router'
import { getResearchLine, researchLines, text, type ResearchLink } from './content/research'
import { getTranslation, posts, type Post, type PostKind } from './content/posts'
import { site, ui, type Language } from './content/site'

const PoreBoostCase = lazy(() => import('./cases/poreboost/PoreBoostCase'))

type SiteContext = { language: Language }

const kindLabels: Record<PostKind, { zh: string; en: string }> = {
  paper: { zh: '论文解读', en: 'Paper explanations' },
  essay: { zh: '个人随笔', en: 'Essays' },
  reading: { zh: '阅读笔记', en: 'Reading notes' },
  guide: { zh: '技术教程', en: 'Technical guides' },
}

const copy = {
  researchPath: { zh: '研究路径', en: 'Research path' },
  researchQuestion: { zh: '核心问题', en: 'Core question' },
  resources: { zh: '成果与开放资源', en: 'Outputs and open resources' },
  next: { zh: '继续推进的问题', en: 'Questions for what comes next' },
  nextIntro: {
    zh: '研究主线不会在论文发表后结束。新的实验、代码与文章可以继续挂接到同一条路径。',
    en: 'A research line does not end at publication. New experiments, code, and articles can remain attached to the same path.',
  },
  all: { zh: '全部', en: 'All' },
  empty: { zh: '这个分类还没有公开文章。', en: 'No public articles in this category yet.' },
  related: { zh: '关联文章', en: 'Related writing' },
  viewAll: { zh: '查看全部', en: 'View all' },
  profiles: { zh: '学术档案', en: 'Academic profiles' },
  profileNote: {
    zh: 'Google Scholar 与 ORCID 将在确认本人链接后接入，避免误连同名研究者。',
    en: 'Google Scholar and ORCID will be connected after the correct personal links are confirmed.',
  },
}

function useLanguage() {
  return useOutletContext<SiteContext>().language
}

function useDocumentTitle(title: string) {
  useEffect(() => { document.title = title }, [title])
}

function ScrollManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function SiteLayout({ language, onLanguageChange }: { language: Language; onLanguageChange: (language: Language) => void }) {
  return <div className="site-shell">
    <aside className="sidebar">
      <div className="sidebar-top">
        <Link className="identity" to="/" aria-label={language === 'zh' ? '返回首页' : 'Back to home'}>
          <span className="name">{site.name[language]}</span>
          <span className="role">{site.role[language]}</span>
        </Link>
        <nav className="main-nav" aria-label={language === 'zh' ? '主导航' : 'Main navigation'}>
          {(['home', 'research', 'writing', 'about'] as const).map(item => {
            const to = item === 'home' ? '/' : `/${item}`
            return <NavLink key={item} to={to} end={item === 'home'}>{ui.nav[item][language]}</NavLink>
          })}
        </nav>
      </div>
      <div className="sidebar-bottom">
        <button className="language-toggle" type="button" onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')} aria-label={ui.language[language]}>
          <span className={language === 'zh' ? 'selected' : ''}>中</span><span> / </span><span className={language === 'en' ? 'selected' : ''}>EN</span>
        </button>
        <a className="github-link" href={site.github} target="_blank" rel="noreferrer">
          <Github size={15} strokeWidth={1.6} />{ui.github[language]}
        </a>
      </div>
    </aside>
    <main className="main-content">
      <Outlet context={{ language } satisfies SiteContext} />
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} {site.name[language]} · {ui.footer[language]}</p>
        <a href={site.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
      </footer>
    </main>
  </div>
}

function Section({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return <section className={`content-section ${className}`}>
    <div className="section-label">{label}</div>
    <div className="section-content">{children}</div>
  </section>
}

function PageHeader({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: ReactNode }) {
  return <header className="page-header">
    <p className="eyebrow">{eyebrow}</p>
    <h1>{title}</h1>
    {intro && <p className="page-intro">{intro}</p>}
    {children}
  </header>
}

function ResearchLinkRow({ link, language }: { link: ResearchLink; language: Language }) {
  const content = <>
    <span className="resource-copy"><strong>{text(link.label, language)}</strong><small>{text(link.description, language)}</small></span>
    {link.external ? <ExternalLink size={17} /> : <ArrowRight size={17} />}
  </>
  return link.external
    ? <a className="resource-row" href={link.href} target="_blank" rel="noreferrer">{content}</a>
    : <Link className="resource-row" to={link.href}>{content}</Link>
}

function PostList({ items, language }: { items: Post[]; language: Language }) {
  return <div className="post-list">
    {items.map(post => {
      const { translation } = getTranslation(post, language)
      if (!translation) return null
      return <Link className="post-row" to={`/writing/${post.slug}`} key={post.slug}>
        <div className="post-meta"><time dateTime={post.date}>{post.date}</time><span>{kindLabels[translation.kind][language]}</span></div>
        <div className="post-summary"><h3>{translation.title}</h3><p>{translation.excerpt}</p></div>
        <ArrowUpRight className="post-arrow" size={18} strokeWidth={1.5} />
      </Link>
    })}
  </div>
}

function HomePage() {
  const language = useLanguage()
  useDocumentTitle(language === 'zh' ? '孟洋 — 个人学术主页' : 'Meng Yang — Academic homepage')
  return <>
    <section className="hero">
      <p className="eyebrow">{language === 'zh' ? 'RESEARCH · WRITING · NOTES' : '研究 · 写作 · 笔记'}</p>
      <h1>{site.heroTitle[language]}</h1>
      <p className="hero-description">{site.heroDescription[language]}</p>
      <p className="availability"><span />{site.availability[language]}</p>
    </section>
    <Section label={`01 / ${ui.nav.research[language]}`}>
      <div className="writing-heading">
        <p className="section-intro">{ui.researchIntro[language]}</p>
        <Link className="section-more" to="/research">{copy.viewAll[language]} <ArrowRight size={14} /></Link>
      </div>
      <div className="research-list">
        {researchLines.map(line => <Link className="research-item research-item-link" to={`/research/${line.slug}`} key={line.slug}>
          <div><span className="research-index">{line.index}</span><h3>{text(line.shortTitle, language)}</h3></div>
          <div><p>{text(line.summary, language)}</p><span className="inline-link">{language === 'zh' ? '展开研究主线' : 'Explore research line'} <ArrowRight size={14} /></span></div>
        </Link>)}
      </div>
    </Section>
    <Section label={`02 / ${ui.nav.writing[language]}`}>
      <div className="writing-heading">
        <p className="section-intro">{ui.writingIntro[language]}</p>
        <Link className="section-more" to="/writing">{copy.viewAll[language]} <ArrowRight size={14} /></Link>
      </div>
      <PostList items={posts.slice(0, 4)} language={language} />
    </Section>
    <Section label={`03 / ${ui.nav.about[language]}`}>
      <div className="about-copy"><p>{site.aboutParagraphs[0][language]}</p></div>
      <Link className="text-arrow-link" to="/about">{language === 'zh' ? '更多关于我' : 'More about me'} <ArrowRight size={15} /></Link>
    </Section>
  </>
}

function ResearchPage() {
  const language = useLanguage()
  useDocumentTitle(`${ui.nav.research[language]} — ${site.name[language]}`)
  return <div className="standard-page">
    <PageHeader
      eyebrow={`RESEARCH / ${ui.nav.research[language]}`}
      title={language === 'zh' ? '让每项工作，都能接上下一步。' : 'Every project should lead somewhere.'}
      intro={language === 'zh'
        ? '研究方向不是孤立成果的陈列架。每条主线持续收录研究问题、阶段进展、论文、代码、数据与后续工作。'
        : 'Research areas are not shelves of isolated outputs. Each line connects questions, milestones, papers, code, data, and what comes next.'}
    />
    <div className="research-line-index">
      {researchLines.map(line => <Link to={`/research/${line.slug}`} className="research-line-card" key={line.slug}>
        <div className="research-line-top"><span>{line.index}</span><span>{text(line.status, language)}</span></div>
        <h2>{text(line.shortTitle, language)}</h2>
        <p>{text(line.summary, language)}</p>
        <div className="keyword-list">{line.keywords.map(keyword => <span key={keyword.en}>{text(keyword, language)}</span>)}</div>
        <span className="inline-link">{language === 'zh' ? '查看研究路径与成果' : 'View path and outputs'} <ArrowRight size={15} /></span>
      </Link>)}
    </div>
  </div>
}

function ResearchDetailPage() {
  const language = useLanguage()
  const { slug } = useParams()
  const line = getResearchLine(slug)
  useDocumentTitle(line ? `${text(line.shortTitle, language)} — ${site.name[language]}` : copy.empty[language])
  if (!line) return <NotFoundPage />
  const related = posts.filter(post => {
    const { translation } = getTranslation(post, language)
    return translation?.research === line.slug
  })
  return <article className="standard-page research-detail">
    <Link className="back-link" to="/research"><ArrowLeft size={15} />{language === 'zh' ? '返回研究主线' : 'All research lines'}</Link>
    <PageHeader eyebrow={`${line.index} / ${text(line.status, language)}`} title={text(line.title, language)} intro={text(line.summary, language)}>
      <div className="keyword-list">{line.keywords.map(keyword => <span key={keyword.en}>{text(keyword, language)}</span>)}</div>
    </PageHeader>
    <Section label={`01 / ${copy.researchQuestion[language]}`}><p className="research-question">{text(line.question, language)}</p></Section>
    <Section label={`02 / ${copy.researchPath[language]}`}>
      <ol className="research-timeline">
        {line.stages.map((stage, index) => <li key={stage.title.en}>
          <span className="timeline-number">{String(index + 1).padStart(2, '0')}</span>
          <div><span className="timeline-date">{text(stage.date, language)}</span><h3>{text(stage.title, language)}</h3><p>{text(stage.summary, language)}</p></div>
        </li>)}
      </ol>
    </Section>
    <Section label={`03 / ${copy.resources[language]}`}>
      <div className="resource-table">{line.resources.map(resource => <ResearchLinkRow key={resource.href} link={resource} language={language} />)}</div>
      {line.interactive && <div className="case-invitation">
        <span className="eyebrow">INTERACTIVE CASE / 独立案例</span>
        <h2>{language === 'zh' ? '不只阅读结论，也亲手走一遍研究。' : 'Do not just read the results. Walk through the research.'}</h2>
        <p>{text(line.interactive.description, language)}</p>
        <Link className="primary-link" to={line.interactive.href}>{text(line.interactive.label, language)} <ArrowUpRight size={17} /></Link>
      </div>}
    </Section>
    <Section label={`04 / ${copy.next[language]}`}>
      <p className="section-intro">{copy.nextIntro[language]}</p>
      <ol className="question-list">{line.nextQuestions.map((question, index) => <li key={question.en}><span>0{index + 1}</span><p>{text(question, language)}</p></li>)}</ol>
    </Section>
    {related.length > 0 && <Section label={`05 / ${copy.related[language]}`}><PostList items={related} language={language} /></Section>}
  </article>
}

function WritingPage() {
  const language = useLanguage()
  const [filter, setFilter] = useState<'all' | PostKind>('all')
  useDocumentTitle(`${ui.nav.writing[language]} — ${site.name[language]}`)
  const filtered = useMemo(() => posts.filter(post => {
    if (filter === 'all') return true
    const { translation } = getTranslation(post, language)
    return translation?.kind === filter
  }), [filter, language])
  return <div className="standard-page">
    <PageHeader
      eyebrow={`WRITING / ${ui.nav.writing[language]}`}
      title={language === 'zh' ? '把阅读、思考与方法留下来。' : 'Keep the reading, thinking, and methods.'}
      intro={language === 'zh'
        ? '这里混合收录已发表论文的解读、个人随笔、有趣文章的阅读笔记，以及从私有原稿库中选择性公开的技术教程。'
        : 'A mixed archive of published-paper explanations, personal essays, notes on interesting reading, and technical guides selectively released from a private draft library.'}
    />
    <div className="writing-taxonomy" aria-label={language === 'zh' ? '文章分类' : 'Article categories'}>
      {(Object.keys(kindLabels) as PostKind[]).map((kind, index) => <div key={kind}><span>0{index + 1}</span><strong>{kindLabels[kind][language]}</strong></div>)}
    </div>
    <div className="filter-bar" role="group" aria-label={language === 'zh' ? '筛选文章' : 'Filter articles'}>
      <button type="button" className={filter === 'all' ? 'active' : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>{copy.all[language]} <span>{posts.length}</span></button>
      {(Object.keys(kindLabels) as PostKind[]).map(kind => <button type="button" key={kind} className={filter === kind ? 'active' : ''} aria-pressed={filter === kind} onClick={() => setFilter(kind)}>{kindLabels[kind][language]}</button>)}
    </div>
    <p className="filter-result">{language === 'zh' ? `显示 ${filtered.length} 篇文章` : `${filtered.length} article${filtered.length === 1 ? '' : 's'}`}</p>
    {filtered.length ? <PostList items={filtered} language={language} /> : <div className="empty-state"><p>{copy.empty[language]}</p><button type="button" onClick={() => setFilter('all')}>{copy.all[language]}</button></div>}
  </div>
}

function PostPage() {
  const language = useLanguage()
  const { slug } = useParams()
  const post = posts.find(item => item.slug === slug)
  const result = post ? getTranslation(post, language) : undefined
  const translation = result?.translation
  useDocumentTitle(translation ? `${translation.title} — ${site.name[language]}` : ui.missing[language])
  if (!post || !translation || !result) return <NotFoundPage />
  return <article className="article-page">
    <Link className="back-link" to="/writing"><ArrowLeft size={15} />{ui.back[language]}</Link>
    <header className="article-header">
      <div className="article-meta"><span>{kindLabels[translation.kind][language]}</span><time dateTime={post.date}>{post.date}</time><span>{translation.category}</span></div>
      <h1>{translation.title}</h1>
      <p className="article-deck">{translation.excerpt}</p>
    </header>
    {result.isFallback && <p className="language-notice">{ui.fallback[language]}</p>}
    <div className="article-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{translation.body}</ReactMarkdown></div>
    {translation.research && getResearchLine(translation.research) && <div className="article-end">
      <span className="eyebrow">{language === 'zh' ? '所属研究主线' : 'RESEARCH LINE'}</span>
      <Link className="text-arrow-link" to={`/research/${translation.research}`}>{text(getResearchLine(translation.research)!.shortTitle, language)} <ArrowRight size={15} /></Link>
    </div>}
  </article>
}

function AboutPage() {
  const language = useLanguage()
  useDocumentTitle(`${ui.nav.about[language]} — ${site.name[language]}`)
  return <div className="standard-page about-page">
    <PageHeader eyebrow={`ABOUT / ${ui.nav.about[language]}`} title={language === 'zh' ? '关于孟洋' : 'About Meng Yang'} />
    <p className="placeholder-note">{site.placeholder[language]}</p>
    <div className="about-copy">{site.aboutParagraphs.map(paragraph => <p key={paragraph.en}>{paragraph[language]}</p>)}</div>
    <dl className="details-list">{site.details.map(detail => <div key={detail.label.en}><dt>{detail.label[language]}</dt><dd>{detail.value[language]}</dd></div>)}</dl>
    <section className="profile-section">
      <span className="eyebrow">{copy.profiles[language]}</span>
      <p>{copy.profileNote[language]}</p>
      <a className="text-arrow-link" href={site.github} target="_blank" rel="noreferrer"><Github size={16} />{ui.github[language]} <ArrowUpRight size={14} /></a>
    </section>
  </div>
}

function NotFoundPage() {
  const language = useLanguage()
  useDocumentTitle(`404 — ${site.name[language]}`)
  return <div className="missing-page"><p className="eyebrow">404 / NOT FOUND</p><h1>{language === 'zh' ? '这个页面还没有被写入。' : 'This page has not been written yet.'}</h1><Link className="back-link" to="/"><ArrowLeft size={15} />{language === 'zh' ? '返回首页' : 'Back home'}</Link></div>
}

function InteractiveCase() {
  useDocumentTitle('PoreBoostGAN — Meng Yang')
  return <Suspense fallback={<div className="case-loading"><span>PoreBoostGAN</span><p>正在加载交互研究案例…<br />Loading interactive research case…</p></div>}><PoreBoostCase /></Suspense>
}

export default function AcademicSite() {
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem('preferred-language') === 'en' ? 'en' : 'zh' } catch { return 'zh' }
  })
  const changeLanguage = (next: Language) => {
    setLanguage(next)
    try { localStorage.setItem('preferred-language', next) } catch { /* Browsing can continue without storage. */ }
  }
  useEffect(() => { document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en' }, [language])
  return <>
    <ScrollManager />
    <Routes>
      <Route path="/research/super-resolution/interactive" element={<InteractiveCase />} />
      <Route element={<SiteLayout language={language} onLanguageChange={changeLanguage} />}>
        <Route index element={<HomePage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="research/:slug" element={<ResearchDetailPage />} />
        <Route path="writing" element={<WritingPage />} />
        <Route path="writing/:slug" element={<PostPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </>
}
