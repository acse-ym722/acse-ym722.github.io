export type Language = 'zh' | 'en'
export type LocalizedText = Record<Language, string>

/** 站点公开内容配置。 */
export const site = {
  name: { zh: '孟洋', en: 'Meng Yang' } satisfies LocalizedText,
  role: { zh: '个人学术主页', en: 'Personal academic homepage' } satisfies LocalizedText,
  github: 'https://github.com/acse-ym722',
  scholar: 'https://scholar.google.com/citations?user=HVADdVEAAAAJ&hl=zh-CN',
  orcid: 'https://orcid.org/0000-0002-4444-5445',
  placeholder: {
    zh: '示例内容 · 在 src/content/site.ts 中替换',
    en: 'Placeholder · Edit src/content/site.ts',
  } satisfies LocalizedText,
  heroTitle: {
    zh: '研究、写作，以及持续整理知识。',
    en: 'Research, writing, and a living archive of ideas.',
  } satisfies LocalizedText,
  heroDescription: {
    zh: '记录数字岩心图像超分辨率研究，也整理论文解读、阅读笔记与值得长期保留的技术方法。',
    en: 'Documenting super-resolution research for digital rock images, alongside paper explanations, reading notes, and technical methods worth keeping.',
  } satisfies LocalizedText,
  availability: {
    zh: '数字岩心 · 图像超分辨率 · 多尺度孔隙结构',
    en: 'Digital rock · Image super-resolution · Multiscale pore structures',
  } satisfies LocalizedText,
  research: [
    {
      title: { zh: '研究方向一', en: 'Research area one' },
      description: {
        zh: '写下一个具体研究问题，以及你希望通过什么方法回答它。',
        en: 'Describe one specific research question and the methods you use to investigate it.',
      },
    },
    {
      title: { zh: '研究方向二', en: 'Research area two' },
      description: {
        zh: '可以介绍正在进行的项目、代表性工作，或长期关注的研究主题。',
        en: 'Introduce an ongoing project, representative work, or a long-term research theme.',
      },
    },
    {
      title: { zh: '研究方向三', en: 'Research area three' },
      description: {
        zh: '保持每项介绍简短；需要展开的内容可以写成一篇独立文章。',
        en: 'Keep each summary concise; expand deeper ideas into a separate article.',
      },
    },
  ],
  aboutParagraphs: [
    {
      zh: '在这里写一段简短的自我介绍：你的身份、研究经历，以及这个主页会记录什么。',
      en: 'Write a short introduction here: who you are, your research path, and what this homepage will document.',
    },
    {
      zh: '你也可以说明希望与哪些人交流，以及最适合联系你的方式。',
      en: 'You can also mention the conversations you welcome and the best way to reach you.',
    },
  ],
  details: [
    { label: { zh: '当前身份', en: 'Current role' }, value: { zh: '待补充', en: 'To be added' } },
    { label: { zh: '所在机构', en: 'Affiliation' }, value: { zh: '待补充', en: 'To be added' } },
    {
      label: { zh: '研究关键词', en: 'Keywords' },
      value: { zh: '关键词一、关键词二、关键词三', en: 'Keyword one, keyword two, keyword three' },
    },
  ],
}

export const ui = {
  nav: {
    home: { zh: '首页', en: 'Home' },
    research: { zh: '科研', en: 'Research' },
    writing: { zh: '文章', en: 'Writing' },
    about: { zh: '关于', en: 'About' },
  },
  researchIntro: {
    zh: '用清晰的问题组织研究，而不是堆砌项目。',
    en: 'Organize research around clear questions, not a pile of projects.',
  },
  writingIntro: {
    zh: '科研经验、论文解读与长期值得保留的笔记。',
    en: 'Research notes, paper readings, and ideas worth keeping.',
  },
  latest: { zh: '文章索引', en: 'Writing index' },
  read: { zh: '阅读文章', en: 'Read article' },
  back: { zh: '返回文章列表', en: 'Back to writing' },
  missing: { zh: '没有找到这篇文章。', en: 'This article could not be found.' },
  fallback: {
    zh: '这篇文章暂未提供中文版本，当前显示英文原文。',
    en: 'This article is not yet available in English; the Chinese version is shown.',
  },
  language: { zh: '切换至英文', en: 'Switch to Chinese' },
  github: { zh: 'GitHub 主页', en: 'GitHub profile' },
  footer: {
    zh: '以 Markdown 写作，以静态页面长期维护。',
    en: 'Written in Markdown. Maintained as a static site.',
  },
}
