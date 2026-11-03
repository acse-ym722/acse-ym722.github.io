import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import * as images from './assets'
import { ArrowDown, ArrowRight, BookOpen, Check, Copy, Database, ExternalLink, FileText, Github, Layers3, Microscope, ScanSearch } from 'lucide-react'
import { CompareSlider, DownsampleDemo, FigureViewer, Metric, SectionHeading, Stepper } from './ResearchUI'
import './case.css'

const links = {
  paper: 'https://doi.org/10.2118/234678-PA',
  github: 'https://github.com/acse-ym722/PoreBoostGAN',
  github3d: 'https://github.com/acse-ym722/PoreBoostGAN_3DSR',
  data: 'https://data.mendeley.com/datasets/6kvtfb5kts/1',
  mrccm: 'https://www.digitalrocksportal.org/projects/362',
  zenodo: 'https://doi.org/10.5281/zenodo.18809715',
}

const nav = [
  ['overview', '速览'], ['principle', '1 · 原理'], ['global', '2 · 全局高分'], ['beyond', '3 · 超越极限'], ['downsample', '4 · 下采样'], ['resources', '5 · 资源'],
]

const globalSteps = [
  { title: '跨分辨率对齐', text: '先将局部 HR 图像下采样，在全局 LR 图像中模板匹配，找到同一空间位置；再裁出对应区域，构成严格配对的 LR–HR 训练样本。' },
  { title: '学习局部到全局的映射', text: '局部 HR 提供微孔、裂缝与边界细节，配对的全局 LR 提供输入。SwinIRGAN 学习的是“同一岩石区域从低分到高分如何变化”，而非凭空美化。' },
  { title: '重建完整三维岩心', text: '将训练好的模型应用于完整 LR 岩心，先在 XY 面超分，再处理 XZ／YZ 方向并进行去噪与分割，得到兼顾大视野和微细结构的全局 HR 数字岩心。' },
]

const principleSteps = [
  { title: '浅层特征提取', text: '卷积层先把 CT 灰度图映射为特征，保留孔隙与矿物基质的基本空间结构。' },
  { title: '窗口注意力', text: 'Swin Transformer 在局部窗口内计算注意力，以可控计算量识别孔壁、裂缝和颗粒之间的依赖关系。' },
  { title: '移位连接全局', text: '下一层移动窗口边界，让原本分属不同窗口的区域交换信息；逐层堆叠后，局部细节与长程结构被共同建模。' },
  { title: 'GAN 物理细节约束', text: '在 SwinIR 上引入对抗损失，并与像素、感知等约束共同训练，在视觉真实感与孔隙拓扑、比表面积等物理参数之间取得平衡。' },
]

function GlobalFlow({ active }: { active: number }) {
  return <div className={`global-flow phase-${active}`}>
    <div className="flow-source"><div className="flow-image large"><img src={images.lrGlobal} alt="全局低分辨率碳酸盐岩图像" /><span>全局 LR</span></div><small>大视野 · 细节模糊</small></div>
    <div className="flow-source"><div className="flow-image"><img src={images.hrLocal} alt="局部高分辨率碳酸盐岩图像" /><span>局部 HR</span></div><small>小视野 · 细节清晰</small></div>
    <div className="flow-operation"><span>{active === 0 ? '下采样＋模板匹配' : active === 1 ? '配对训练' : '整块推理＋三维重建'}</span><ArrowRight size={24} /></div>
    <div className="flow-output"><div className="flow-image output"><img src={active === 0 ? images.lrGlobal : active === 1 ? images.hrLocal : images.reconstructSwinirgan} alt="当前流程输出" /><span>{active === 0 ? '配对区域' : active === 1 ? 'SwinIRGAN' : '全局 SR'}</span></div><small>{active === 0 ? '同一位置 · 两种尺度' : active === 1 ? '学习 LR → HR 映射' : '大视野 · 微细结构'}</small></div>
  </div>
}

function ArchitectureVisual({ active }: { active: number }) {
  return <div className={`architecture-visual stage-${active}`} aria-label="SwinIRGAN 原理示意图">
    <div className="architecture-input"><img src={images.reconstructBicubic} alt="低分辨率输入" /><span>LR 输入</span></div>
    <div className="window-field" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} className={(i + active) % 5 === 0 ? 'focus' : ''} />)}<span>{active < 2 ? 'W-MSA' : 'SW-MSA'}</span></div>
    <div className="architecture-block"><Layers3 size={28} /><strong>{active === 0 ? 'Conv' : active === 3 ? 'SwinIR + GAN' : 'RSTB'}</strong><span>{active === 0 ? '浅层特征' : active === 3 ? '感知与物理平衡' : '深层特征'}</span></div>
    <div className="architecture-output"><img src={images.reconstructSwinirgan} alt="超分辨率输出" /><span>SR 输出</span></div>
  </div>
}

function PoreBoostCase() {
  const [globalStep, setGlobalStep] = useState(0)
  const [principleStep, setPrincipleStep] = useState(0)
  const [strategy, setStrategy] = useState<'twice' | 'once'>('twice')
  const [activeSection, setActiveSection] = useState('overview')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const sections = nav.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.1, 0.3] })
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const copyCitation = async () => {
    const citation = '@article{Meng2026PoreBoostGAN,\n  author = {Meng, Yang and Tang, Kunning and Xie, Heping and Chen, Zhangxin and Teng, Ying and Chen, Yuntian and Li, Cunbao and An, Senyou},\n  title = {Super-Resolution Carbonate Rock Image Beyond Instrument Limitations},\n  journal = {SPE Journal},\n  year = {2026},\n  doi = {10.2118/234678-PA}\n}'
    try { await navigator.clipboard.writeText(citation); setCopied(true); window.setTimeout(() => setCopied(false), 2200) } catch { setCopied(false) }
  }

  return <div className="poreboost-case">
    <a className="skip-link" href="#overview">跳到正文</a>
    <header className="site-header">
      <div className="header-inner">
        <Link className="case-backlink" to="/research/super-resolution">← 返回研究主线 / Research line</Link>
        <div className="brand-mark">PoreBoost<span>GAN</span></div>
        <div className="paper-kicker">交互式论文讲解 · DIGITAL ROCK PHYSICS</div>
        <h1>Super-Resolution Carbonate Rock Image<br className="desktop-break" /> Beyond Instrument Limitations</h1>
        <p className="chinese-title">超越仪器极限的碳酸盐岩图像超分辨率重建</p>
        <div className="byline">Yang Meng · Kunning Tang · Heping Xie · Zhangxin Chen · Ying Teng · Yuntian Chen · Cunbao Li · Senyou An</div>
        <div className="paper-meta"><span>SPE Journal · 2026</span><a href={links.paper} target="_blank" rel="noreferrer">DOI: 10.2118/234678-PA <ExternalLink size={12} /></a><a href={links.github} target="_blank" rel="noreferrer"><Github size={13} />代码与模型</a></div>
      </div>
      <nav className="top-nav" aria-label="页面章节">
        <div className="nav-inner">{nav.map(([id, label]) => <a key={id} className={activeSection === id ? 'active' : ''} href={`#${id}`}>{label}</a>)}<a className="nav-github" href={links.data} target="_blank" rel="noreferrer"><Database size={14} />开放数据</a></div>
      </nav>
    </header>

    <main>
      <section id="overview" className="paper-section overview-section">
        <SectionHeading number="0" title="一分钟速览" intro={<><strong>核心问题：</strong>micro-CT 的大视野与高分辨率难以兼得。本研究用局部 HR 扫描“教会”模型理解全局 LR 图像，再把学到的跨尺度映射用于整块岩心，甚至外推到仪器未曾直接拍到的尺度。</>} />
        <div className="overview-grid">
          <article><span className="tag magenta">矛盾</span><h3>看得大，就看不细</h3><p>碳酸盐岩孔隙跨越多个尺度。全局 LR 扫描保留岩心全貌，却会模糊微孔、裂缝与孔壁；局部 HR 扫描看清细节，又失去完整空间信息。</p></article>
          <article><span className="tag blue">方法</span><h3>SwinIRGAN</h3><p>用移位窗口注意力连接局部与长程结构，再以 GAN 约束增强高频细节。目标不只是“更清晰”，更是让孔隙度、Euler 数和比表面积更可靠。</p></article>
          <article><span className="tag ochre">推进</span><h3>重建 → 外推 → 下采样</h3><p>先做全局 HR 重建，再预测 ultraHR；将 ultraHR 下采样回原尺寸后，部分细结构影响仍被保留，为无 ultraHR 真值时的分析提供新路径。</p></article>
        </div>
        <div className="hero-evidence">
          <div className="hero-rock"><img src={images.heroRock} alt="多分辨率碳酸盐岩三维数字岩心" /><span className="scan-line" aria-hidden="true" /></div>
          <div className="hero-evidence-copy"><span className="mini-label">FROM PIXELS TO PHYSICS</span><h2>图像更清晰，<br />岩石物理也要更可信。</h2><p>评价不止停留在 PSNR、SSIM，而是继续追问：孔径连通关系有没有改变？微孔网络是否被保留？孔壁粗糙度是否接近真实？</p><a href="#principle" className="text-link">从研究原理开始 <ArrowDown size={15} /></a></div>
          <div className="hero-metrics"><Metric value="99.48%" label="Euler 数准确率" note="生物成因碳酸盐岩重建" /><Metric value="97.05%" label="Euler 数准确率" note="更高分辨率外推" /><Metric value="+15.59%" label="Euler 数提升" note="MRCCM 下采样流程，对数坐标" /></div>
        </div>
      </section>

      <section id="principle" className="paper-section">
        <SectionHeading number="1" title="研究原理：让局部细节与全局结构对话" intro={<><strong>讲解要点：</strong>SwinIRGAN 的关键不是单纯增加像素，而是学习不同分辨率之间的结构映射。窗口注意力负责高效提取局部关系，移位窗口逐步打通长程依赖，GAN 则补足真实纹理与高频边界。</>} />
        <Stepper steps={principleSteps} active={principleStep} onChange={setPrincipleStep} label="SwinIRGAN 原理" />
        <ArchitectureVisual active={principleStep} />
        <div className="concept-strip"><div><strong>LR</strong><span>低分辨率输入</span></div><ArrowRight size={18} /><div><strong>特征提取</strong><span>卷积＋残差 Swin Transformer 块</span></div><ArrowRight size={18} /><div><strong>图像重建</strong><span>上采样与高频细节恢复</span></div><ArrowRight size={18} /><div><strong>物理评价</strong><span>孔隙度 · Euler 数 · 比表面积</span></div></div>
        <FigureViewer src={images.figure2Workflow} caption="论文 Figure 2：配对数据集构建、RRDB 与 SwinIR 网络、三维超分及下采样评价流程。" />
      </section>

      <section id="global" className="paper-section">
        <SectionHeading number="2" title="实验一：全局低分＋局部高分，如何得到全局高分？" accent="blue" intro={<><strong>核心思路：</strong>不要求仪器一次拍清整块岩心，而是把“看得全”的 LR 与“看得清”的局部 HR 配成训练对。模型学会局部区域中的跨尺度规律后，再把这种规律推广到完整 LR 岩心。</>} />
        <Stepper steps={globalSteps} active={globalStep} onChange={setGlobalStep} label="全局高分辨率重建" />
        <GlobalFlow active={globalStep} />
        <div className="experiment-grid">
          <div><h3>同一区域，重建方法对照</h3><p className="body-copy">双三次插值只能平滑地填满新增像素；SwinIRGAN 则根据训练中学到的孔隙结构恢复边界和纹理。拖动下方滑块观察差异，右侧 HR 是实测参照。</p><div className="reference-row"><img src={images.reconstructHr} alt="实测高分辨率参照" /><span><strong>HR Ground Truth</strong>实测高分辨率图像，用于定量评价</span></div></div>
          <CompareSlider before={images.reconstructBicubic} after={images.reconstructSwinirgan} beforeLabel="Bicubic" afterLabel="SwinIRGAN" alt="全局重建结果" />
        </div>
        <div className="finding-band blue-band"><span className="finding-label">实验发现</span><p>GAN 类模型在复杂拓扑上表现更突出。对生物成因碳酸盐岩，SwinIRGAN 将 <strong>Euler 数误差降至 0.52%</strong>；比表面积相比双三次插值提高约 <strong>30%</strong>，相比 ESRGAN 提高约 <strong>11%</strong>。</p></div>
        <FigureViewer src={images.figure3Reconstruction} caption="论文 Figure 3：重建图像、图像质量、分割结果与岩石物理参数的综合比较。" />
      </section>

      <section id="beyond" className="paper-section">
        <SectionHeading number="3" title="实验二：如何超出仪器分辨率极限？" accent="magenta" intro={<><strong>研究问题：</strong>如果模型已经学会 LR → HR，它能否继续预测 HR → ultraHR？研究用同一岩石的 16 μm、4 μm 与 1 μm 三档扫描进行验证，其中 1 μm 图像作为 ultraHR 地面真值。</>} />
        <div className="strategy-switch" role="group" aria-label="选择超分辨率外推策略">
          <button className={strategy === 'twice' ? 'active' : ''} onClick={() => setStrategy('twice')}><span>策略 1</span>LR 连续超分两次<small>16 μm → 4 μm → 1 μm</small></button>
          <button className={strategy === 'once' ? 'active' : ''} onClick={() => setStrategy('once')}><span>策略 2</span>以 HR 为输入超分一次<small>4 μm → 1 μm</small></button>
        </div>
        <div className="resolution-rail">
          <div className={strategy === 'twice' ? 'current' : ''}><span>LR</span><strong>16 μm</strong><small>全局低分扫描</small></div><ArrowRight size={22} />
          <div className="current"><span>{strategy === 'twice' ? '中间 SR' : 'HR 输入'}</span><strong>4 μm</strong><small>{strategy === 'twice' ? '第一次 ×4' : '实测高分扫描'}</small></div><ArrowRight size={22} />
          <div className="current accent"><span>ultraHR</span><strong>1 μm</strong><small>{strategy === 'twice' ? '第二次 ×4' : '一次 ×4'} · 预测后验证</small></div>
        </div>
        <div className="experiment-grid beyond-grid">
          <div><h3>预测结果对照 1 μm 实测真值</h3><p className="body-copy">这里展示的是{strategy === 'twice' ? '策略 1：LR 连续两次超分' : '策略 2：HR 再超分一次'}得到的 SwinIRGAN 结果。模型并非“看见”了 1 μm 扫描，而是从已学习的尺度变化规律进行外推，再由独立实测图像检验。</p><div className="caution"><ScanSearch size={19} /><span><strong>预测 ≠ 实测。</strong> ultraHR 的细节包含模型先验，必须通过独立高分辨率扫描和物理参数验证，不能直接当作新观测。</span></div></div>
          <CompareSlider before={images.ultraGroundTruth} after={strategy === 'twice' ? images.ultraSwinirganTwice : images.ultraSwinirganOnce} beforeLabel="1 μm 真值" afterLabel="SwinIRGAN 预测" alt="超高分辨率外推结果" />
        </div>
        <div className="metric-row"><Metric value="≈3%" label="Euler 数预测偏差" note="论文文字报告；摘要对应 97.05% 准确率" /><Metric value="0.38%" label="比表面积误差" note="对数坐标，SwinIRGAN" /><Metric value="224³ → 896³" label="三维体素规模" note="HR 到 ultraHR，边长 ×4" /></div>
        <FigureViewer src={images.figure4Extrapolation} caption="论文 Figure 4：两种 ultraHR 外推策略、三维重建与物理参数评价。" />
      </section>

      <section id="downsample" className="paper-section">
        <SectionHeading number="4" title="实验三：回到原分辨率，为什么还能保留更多信息？" accent="ochre" intro={<><strong>反直觉发现：</strong>将 ultraHR 预测结果下采样回 HR 尺寸后，图像并未简单退回原貌。与原始 HR 扫描相比，下采样结果在 Euler 数和比表面积上表现出更多细结构信息。</>} />
        <div className="explanation-lead"><span>作者解释</span><blockquote>超分时，模型预测并写入了大量微孔、孔壁边界和连通细节；下采样时，这些信息并没有被完全抛弃。区域聚合会把部分细节转化为体素灰度、边界覆盖率和局部统计差异，所以即使图像尺寸回到原样，仍可能保留比原始 HR 更丰富的结构信息。</blockquote></div>
        <DownsampleDemo />
        <div className="experiment-grid downsample-grid">
          <div><h3>原始 HR 与“超分后再下采样”</h3><p className="body-copy">两种图像具有相同的显示尺寸，但形成路径不同：左侧来自仪器直接扫描；右侧先由 SwinIRGAN 生成 ultraHR，再通过双线性插值回到 HR。右侧保留了预测细结构对最终体素的影响。</p><div className="caution green-caution"><Layers3 size={19} /><span>保留的是<strong>部分统计与结构影响</strong>，并非无损保存全部 ultraHR 信息；结果仍依赖超分预测的可靠性。</span></div></div>
          <CompareSlider before={images.downsampleHr} after={images.downsampleSwinirgan} beforeLabel="原始 HR" afterLabel="SR 后下采样" alt="下采样信息保留实验" />
        </div>
        <div className="finding-band green-band"><span className="finding-label">实验发现</span><p>各模型的 <strong>Euler 数提高约 15%</strong>（对数坐标），其中 SwinIRGAN 策略 2 为 <strong>15.59%</strong>；比表面积提高约 <strong>1.5–2.5%</strong>。这说明部分 ultraHR 高频孔隙特征与更细表面结构进入了下采样图像。</p></div>
        <FigureViewer src={images.figure5Downsampling} caption="论文 Figure 5：ultraHR 重建经下采样后的图像与物理参数变化。" />
      </section>

      <section id="resources" className="paper-section resources-section">
        <SectionHeading number="5" title="论文、代码与开放数据" intro={<><strong>复现研究：</strong>论文、二维／三维超分代码和多分辨率碳酸盐岩数据均已提供公开入口。欢迎从原始三维 TIFF 出发，复现配对训练、外推与下采样实验。</>} />
        <div className="resource-list">
          <a href={links.paper} target="_blank" rel="noreferrer"><FileText size={24} /><span><strong>阅读论文</strong><small>SPE Journal · DOI 10.2118/234678-PA</small></span><ExternalLink size={17} /></a>
          <a href={links.github} target="_blank" rel="noreferrer"><Github size={24} /><span><strong>PoreBoostGAN</strong><small>二维与三维超分代码、配置和推理流程</small></span><ExternalLink size={17} /></a>
          <a href={links.data} target="_blank" rel="noreferrer"><Database size={24} /><span><strong>生物成因碳酸盐岩数据集</strong><small>Mendeley Data · 原始三维 TIFF · DOI 10.17632/6kvtfb5kts.1</small></span><ExternalLink size={17} /></a>
          <a href={links.mrccm} target="_blank" rel="noreferrer"><Microscope size={24} /><span><strong>MRCCM 多分辨率数据集</strong><small>Digital Rocks Portal · Project 362</small></span><ExternalLink size={17} /></a>
          <a href={links.zenodo} target="_blank" rel="noreferrer"><BookOpen size={24} /><span><strong>Zenodo 发布版本</strong><small>PoreBoostGAN Release · DOI 10.5281/zenodo.18809715</small></span><ExternalLink size={17} /></a>
        </div>
        <div className="citation-box"><div><span className="mini-label">CITE THIS WORK</span><h3>如果这项研究帮助了你，请引用论文与数据集。</h3><p>Meng, Y. et al. (2026). Super-Resolution Carbonate Rock Image Beyond Instrument Limitations. <i>SPE Journal</i>.</p></div><button onClick={copyCitation}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? 'BibTeX 已复制' : '复制 BibTeX'}</button></div>
      </section>
    </main>

    <footer><div><strong>PoreBoostGAN</strong><span>面向孔尺度分析与流动模拟的可信数字岩心</span></div><p>论文图像：Meng et al. (2026)，CC BY 4.0。交互示意仅用于解释原理，实验结论与数字以论文为准。</p><a href={links.github3d} target="_blank" rel="noreferrer">三维超分仓库 <ExternalLink size={12} /></a></footer>
  </div>
}

export default PoreBoostCase
