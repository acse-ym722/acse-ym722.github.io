import type { Language, LocalizedText } from './site'

export type ResearchLink = {
  label: LocalizedText
  description: LocalizedText
  href: string
  external?: boolean
}

export type ResearchStage = {
  date: LocalizedText
  title: LocalizedText
  summary: LocalizedText
}

export type ResearchLine = {
  slug: string
  index: string
  title: LocalizedText
  shortTitle: LocalizedText
  status: LocalizedText
  summary: LocalizedText
  question: LocalizedText
  keywords: LocalizedText[]
  stages: ResearchStage[]
  resources: ResearchLink[]
  nextQuestions: LocalizedText[]
  interactive?: ResearchLink
}

export const researchLines: ResearchLine[] = [
  {
    slug: 'super-resolution',
    index: 'R–01',
    title: {
      zh: '超越仪器极限的碳酸盐岩图像超分辨率重建',
      en: 'Super-resolution carbonate rock imaging beyond instrument limitations',
    },
    shortTitle: {
      zh: '数字岩心图像超分辨率',
      en: 'Super-resolution for digital rock images',
    },
    status: { zh: '论文已发表 · 持续拓展', en: 'Published · Ongoing directions' },
    summary: {
      zh: '从全局低分辨率与局部高分辨率扫描出发，学习跨尺度结构映射，重建兼顾大视野与微细孔隙的三维数字岩心，并进一步研究 ultraHR 外推与下采样过程中的信息保留。',
      en: 'Learning cross-scale structural mappings from global low-resolution and local high-resolution scans to reconstruct large-field, detail-preserving 3D digital rocks, with further studies of ultraHR extrapolation and information retention during downsampling.',
    },
    question: {
      zh: 'micro-CT 的大视野与高分辨率往往难以兼得。能否让局部清晰扫描“教会”模型理解全局图像，并判断模型补出的细节是否仍然具有可靠的岩石物理意义？',
      en: 'Micro-CT often trades field of view against resolution. Can local, detailed scans teach a model to interpret global images, and can we determine whether the synthesized details remain physically meaningful?',
    },
    keywords: [
      { zh: '数字岩心', en: 'Digital rock' },
      { zh: '图像超分辨率', en: 'Image super-resolution' },
      { zh: 'SwinIRGAN', en: 'SwinIRGAN' },
      { zh: '多尺度孔隙结构', en: 'Multiscale pore structures' },
    ],
    stages: [
      {
        date: { zh: '研究路径 01', en: 'Path 01' },
        title: { zh: '跨尺度配对与全局重建', en: 'Cross-scale pairing and global reconstruction' },
        summary: {
          zh: '将局部 HR 与全局 LR 图像构建为空间对应的训练样本，学习 LR → HR 映射，再用于完整三维岩心。',
          en: 'Spatially paired local HR and global LR images provide training samples for learning an LR → HR mapping that is then applied to the complete 3D core.',
        },
      },
      {
        date: { zh: '研究路径 02', en: 'Path 02' },
        title: { zh: '从 HR 到 ultraHR 的分辨率外推', en: 'Resolution extrapolation from HR to ultraHR' },
        summary: {
          zh: '利用多档真实扫描检验两种外推策略，并以独立 ultraHR 观测和物理参数评价预测结果。',
          en: 'Two extrapolation strategies are examined with multi-resolution scans, using independent ultraHR observations and physical properties for evaluation.',
        },
      },
      {
        date: { zh: '研究路径 03', en: 'Path 03' },
        title: { zh: '超分—下采样过程中的信息保留', en: 'Information retention through SR and downsampling' },
        summary: {
          zh: '将 ultraHR 预测结果下采样回原尺寸，追踪高频孔隙结构与表面信息如何影响最终图像及物理参数。',
          en: 'UltraHR predictions are downsampled to their original dimensions to trace how fine pore and surface information affects the resulting images and physical properties.',
        },
      },
    ],
    resources: [
      {
        label: { zh: '论文 · SPE Journal（2026）', en: 'Paper · SPE Journal (2026)' },
        description: { zh: 'DOI 10.2118/234678-PA', en: 'DOI 10.2118/234678-PA' },
        href: 'https://doi.org/10.2118/234678-PA',
        external: true,
      },
      {
        label: { zh: 'PoreBoostGAN 代码与模型', en: 'PoreBoostGAN code and models' },
        description: { zh: '二维／三维超分代码、配置与推理流程', en: '2D/3D SR code, configurations, and inference workflows' },
        href: 'https://github.com/acse-ym722/PoreBoostGAN',
        external: true,
      },
      {
        label: { zh: '三维超分仓库', en: '3D super-resolution repository' },
        description: { zh: 'PoreBoostGAN_3DSR', en: 'PoreBoostGAN_3DSR' },
        href: 'https://github.com/acse-ym722/PoreBoostGAN_3DSR',
        external: true,
      },
      {
        label: { zh: '多分辨率碳酸盐岩数据', en: 'Multiresolution carbonate rock data' },
        description: { zh: 'Mendeley Data · 原始三维 TIFF', en: 'Mendeley Data · Original 3D TIFF data' },
        href: 'https://data.mendeley.com/datasets/6kvtfb5kts/1',
        external: true,
      },
    ],
    nextQuestions: [
      {
        zh: '跨岩性、跨仪器与跨成像条件下，模型的泛化能力应如何系统评价？',
        en: 'How should generalization be evaluated across lithologies, instruments, and imaging conditions?',
      },
      {
        zh: '如何量化预测细结构的不确定性，并区分真实结构恢复与模型先验？',
        en: 'How can uncertainty in predicted fine structures be quantified, separating structural recovery from model priors?',
      },
      {
        zh: '二维与三维超分流程如何进一步衔接，并服务于孔尺度分析与流动模拟？',
        en: 'How can 2D and 3D SR workflows be better connected for pore-scale analysis and flow simulation?',
      },
    ],
    interactive: {
      label: { zh: '进入交互式研究案例', en: 'Open the interactive research case' },
      description: {
        zh: '通过图像对比、步骤演示与论文原图，完整理解研究原理和三组核心实验。',
        en: 'Explore the method and three core experiments through image comparisons, guided steps, and original paper figures.',
      },
      href: '/research/super-resolution/interactive',
    },
  },
]

export function getResearchLine(slug?: string) {
  return researchLines.find(line => line.slug === slug)
}

export function text(value: LocalizedText, language: Language) {
  return value[language]
}
