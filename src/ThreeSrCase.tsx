import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, Box, Boxes, Check, Copy, Database, ExternalLink, FileCode2, Github, Layers3, MemoryStick, ScanLine } from 'lucide-react'
import { FigureViewer, Metric, SectionHeading, Stepper } from './components/ResearchUI'
import { AxisContinuity, MemoryLab, TilingDemo, UpsamplingLab } from './components/ThreeDLab'
import * as images from './cases/poreboost/assets'
import './App.css'
import './ThreeSrCase.css'

const repo = 'https://github.com/acse-ym722/PoreBoostGAN_3DSR'
const repo2d = 'https://github.com/acse-ym722/PoreBoostGAN'
const nav = [['overview', '速览'], ['2d', '1 · 2D 原理'], ['why3d', '2 · 为什么 3D'], ['training', '3 · 训练'], ['inference', '4 · 推理'], ['limits', '5 · 显存'], ['code', '6 · 复现']]

const trainingSteps = [
  { title: '准备配对体数据', text: '同一岩石区域的 LR 与 HR 三维 TIFF／NPY 必须在空间上对齐。代码会检查 HR 的 D、H、W 是否分别等于 LR 的对应尺寸乘以超分倍率。' },
  { title: '沿 XYZ 切立方块', text: '以 HR 为基准沿 Z、Y、X 三个方向滑动裁块，并用同一坐标规则裁出 LR。示例中 HR 块为 64³；×4 时，对应 LR 块为 16³。' },
  { title: '组成五维训练张量', text: '单个样本按 C×D×H×W 组织，加入 batch 后成为 B×C×D×H×W。灰度岩心通常 C=1；D 就是切片数量，也是二维模型缺少的显式输入维度。' },
  { title: '三维网络与损失', text: '3D 卷积或 3D Swin Transformer 联合学习 XYZ 特征，再进行 PixelShuffle3D 上采样。SwinIRGAN3D 还使用三维判别器，并结合像素与对抗损失训练。' },
]

const commands = {
  data: `python tools/extract_xyz_cubes.py \
  --hr-dir data/.../High/train \
  --lr-dir data/.../Low/train \
  --hr-out-dir data/.../High_sub3d/train \
  --lr-out-dir data/.../Low_sub3d/train \
  --scale 4 --hr-cube-size 64 --step 64`,
  train: `python src/train.py \
  -opt configs/train/poreboostgan_swinirgan3d_x4_4090.yml`,
  infer: `python tools/infer_3d_volume_reconstruct.py \
  --input data/c2_360_360_1024.tif \
  --output results/c2_sr_x2_reconstruct.tif \
  --model-path experiments/.../net_g_2000.pth \
  --config experiments/.../poreboostgan_esrgan3d_x2_4090.yml \
  --device cuda --fp16 --core-size 64 --context 16 \
  --save-dtype uint8`,
}

function CodePanel() {
  const [mode, setMode] = useState<keyof typeof commands>('train')
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    const textarea = document.createElement('textarea')
    textarea.value = commands[mode]
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    let success = document.execCommand('copy')
    textarea.remove()
    if (!success) {
      try { await navigator.clipboard.writeText(commands[mode]); success = true } catch { success = false }
    }
    setCopied(success)
    if (success) window.setTimeout(() => setCopied(false), 1800)
  }
  return <div className="code-panel">
    <div className="code-toolbar"><div className="segmented" role="group" aria-label="选择代码流程"><button className={mode === 'data' ? 'active' : ''} onClick={() => setMode('data')}>裁块</button><button className={mode === 'train' ? 'active' : ''} onClick={() => setMode('train')}>训练</button><button className={mode === 'infer' ? 'active' : ''} onClick={() => setMode('infer')}>完整推理</button></div><button className="copy-code" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? '已复制' : '复制命令'}</button></div>
    <pre><code>{commands[mode]}</code></pre>
    <div className="code-note">{mode === 'data' ? 'HR 与 LR 使用对应的坐标和步长；hr-cube-size 与 step 必须能被 scale 整除。' : mode === 'train' ? '配置示例：SwinIR3D、×4、window_size=4、batch_size_per_gpu=1。' : '每个块带上下文推理，只保留中心核心；可选 FP16，并输出 NPY 或 ImageJ 兼容 TIFF。'}</div>
  </div>
}

function App() {
  const [trainStep, setTrainStep] = useState(0)
  const [activeSection, setActiveSection] = useState('overview')
  useEffect(() => {
    const sections = nav.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, .1, .3] })
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return <>
    <a className="skip-link" href="#overview">跳到正文</a>
    <header className="site-header">
      <div className="header-inner">
        <a className="case-backlink" href="/research/super-resolution" target="_parent">← 返回研究主线 / Research line</a>
        <div className="brand-mark">PoreBoost<span>GAN · 3DSR</span></div>
        <div className="paper-kicker">交互式技术科普 · FROM SLICES TO VOLUMES</div>
        <h1>从一张切片，到一个<br className="desktop-break" />真正连续的三维岩心</h1>
        <p className="chinese-title">2D／3D 超分辨率训练、推理与显存权衡</p>
        <p className="hero-summary">不只讲“三维更好”，而是把体素、PixelShuffle3D、立方块训练、中心可信拼接与局部感受野一次讲透。</p>
        <div className="paper-meta"><span>PoreBoostGAN_3DSR · 技术讲解</span><a href={repo} target="_blank" rel="noreferrer"><Github size={13} />3D 代码仓库 <ExternalLink size={12} /></a><a href={repo2d} target="_blank" rel="noreferrer">2D 项目与论文素材 <ExternalLink size={12} /></a></div>
      </div>
      <nav className="top-nav" aria-label="页面章节"><div className="nav-inner">{nav.map(([id, label]) => <a key={id} className={activeSection === id ? 'active' : ''} href={`#${id}`}>{label}</a>)}<a className="nav-github" href="https://data.mendeley.com/datasets/6kvtfb5kts/1" target="_blank" rel="noreferrer"><Database size={14} />开放数据</a></div></nav>
    </header>

    <main>
      <section id="overview" className="paper-section overview-section">
        <SectionHeading number="0" title="一分钟速览" intro={<><strong>核心区别：</strong>2D 超分学习的是“这一张切片里，低分像素如何变成高分像素”；3D 超分学习的是“这一小段三维空间里，低分体素如何变成高分体素”。多出来的 D 维，让模型直接利用 Z 轴上下文，也让数据与计算成本迅速增长。</>} />
        <div className="overview-grid">
          <article><span className="tag magenta">2D</span><h3>逐层看清 XY</h3><p>输入 C×H×W，擅长恢复每张切片的孔壁和纹理，计算相对轻；但各层独立处理时，Z 方向的连续性需要额外流程保障。</p></article>
          <article><span className="tag blue">3D</span><h3>联合理解 XYZ</h3><p>输入 C×D×H×W，三维卷积或注意力同时读取相邻切片，更适合学习孔道延伸、裂缝连接和真实三维拓扑。</p></article>
          <article><span className="tag ochre">代价</span><h3>显存与视野受限</h3><p>边长翻倍，体素变 8 倍；×4 超分输出则是输入的 64 倍。于是训练只能用小块，大岩心推理必须分块，单块感受野也始终有限。</p></article>
        </div>
        <div className="hero-evidence">
          <div className="hero-rock"><img src={images.heroRock} alt="三维碳酸盐岩数字岩心" /><span className="scan-line" aria-hidden="true" /></div>
          <div className="hero-evidence-copy"><span className="mini-label">THE THIRD DIMENSION</span><h2>三维超分，<br />不是多处理几张图。</h2><p>它改变的是网络接收信息的方式：从一张平面图像，变成一段具有上下、前后、左右关系的空间体数据。</p><a href="#2d" className="text-link">先从 2D 底层原理开始 <ArrowDown size={15} /></a></div>
          <div className="hero-metrics"><Metric value="C·D·H·W" label="三维输入组织方式" note="加入 batch 后为五维张量" /><Metric value="r³" label="三维空间重排" note="PixelShuffle3D 的通道关系" /><Metric value="64³＋16" label="核心块与上下文" note="完整体积推理的典型配置" /></div>
        </div>
      </section>

      <section id="2d" className="paper-section">
        <SectionHeading number="1" title="2D 超分的底层原理：学习如何补回高频结构" intro={<><strong>先看本质：</strong>双三次插值根据邻近像素做数学加权，不知道“孔壁应该长什么样”；学习型超分则从配对 LR–HR 数据中提取特征，学习岩石结构在不同尺度之间的映射，再把特征重排成更高分辨率图像。</>} />
        <div className="concept-strip"><div><strong>LR 图像</strong><span>C × H × W</span></div><ArrowRight size={18} /><div><strong>特征提取</strong><span>卷积／残差块／窗口注意力</span></div><ArrowRight size={18} /><div><strong>通道重排</strong><span>PixelShuffle2D</span></div><ArrowRight size={18} /><div><strong>SR 图像</strong><span>rH × rW</span></div></div>
        <div className="two-col-explainer"><div><h3>训练时，模型拿什么监督自己？</h3><p>生成器输出 SR，与真实 HR 计算像素损失；GAN 模型还让判别器区分 SR 与 HR，促使孔壁、裂缝和颗粒纹理更接近真实分布。训练完成后，判别器不参与普通推理。</p></div><div className="formula-box"><span>2D 卷积</span><strong>K × K</strong><p>每次只看局部平面邻域</p><span>2D 上采样</span><strong>C·r² → C</strong><p>把通道分配给 r×r 个像素位置</p></div></div>
        <UpsamplingLab />
        <FigureViewer src={images.figure2Workflow} caption="研究素材：二维 SR 网络、配对训练以及多平面三维重建流程。原论文采用 XY 超分后，再处理 XZ／YZ 方向并去噪。" />
      </section>

      <section id="why3d" className="paper-section">
        <SectionHeading number="2" title="为什么 3D 在 Z 轴上更有优势？" accent="blue" intro={<><strong>关键不是“多一维”这个名词，而是信息真的同时进入网络：</strong>3D 模型在预测某个体素时，可以直接参考它前后相邻切片中的结构；2D 逐层模型默认只能看当前切片，层与层之间没有天然通信。</>} />
        <AxisContinuity />
        <div className="comparison-table" role="table" aria-label="二维和三维超分比较">
          <div className="table-head" role="row"><span role="columnheader">比较维度</span><strong role="columnheader">2D 逐层超分</strong><strong role="columnheader">3D 体超分</strong></div>
          <div role="row"><span>网络输入</span><p>C×H×W，一次一层</p><p>C×D×H×W，一次一段体积</p></div>
          <div role="row"><span>Z 轴信息</span><p>不直接进入当前层推理</p><p>通过 3D 卷积／3D 窗口直接参与</p></div>
          <div role="row"><span>适合恢复</span><p>层内孔壁、颗粒纹理</p><p>孔道连续、裂缝延伸、三维连通</p></div>
          <div role="row"><span>大体积策略</span><p>多平面处理＋去噪等后处理</p><p>三维分块推理＋中心可信拼接</p></div>
          <div role="row"><span>主要代价</span><p>Z 一致性较间接</p><p>显存高、块小、感受野受限</p></div>
        </div>
        <div className="finding-band blue-band"><span className="finding-label">不要绝对化</span><p><strong>2D 并非不能完成三维重建。</strong>研究论文已经采用 XY 超分、XZ／YZ 处理与去噪来改善三维结果。3D 的优势是更直接地联合学习 XYZ，而不是保证任何情况下都优于精心设计的 2D 流程。</p></div>
      </section>

      <section id="training" className="paper-section">
        <SectionHeading number="3" title="3D 如何训练：把配对岩心切成立方体" intro={<><strong>训练目标：</strong>让网络从大量小型 LR→HR 立方体中学习三维跨尺度映射。裁块不是为了改变科学问题，而是让体数据能够放进显存，并完成反向传播。</>} />
        <Stepper steps={trainingSteps} active={trainStep} onChange={setTrainStep} label="三维超分训练流程" />
        <div className={`training-pipeline phase-${trainStep}`}>
          <div className="training-volume"><div className="volume-cube">{Array.from({ length: 5 }, (_, i) => <i key={i} style={{ '--layer': i, backgroundImage: `url(${i === 4 ? images.reconstructSwinirgan : images.reconstructBicubic})` } as React.CSSProperties} />)}<span>LR 体积</span></div><small>D × H × W</small></div>
          <div className="training-operation"><ArrowRight size={22} /><strong>{trainStep === 0 ? '空间对齐' : trainStep === 1 ? 'XYZ 裁块' : trainStep === 2 ? '组成张量' : '前向＋反向传播'}</strong><span>{trainStep === 0 ? '同一区域、同一坐标' : trainStep === 1 ? 'HR 64³ ↔ LR 16³（×4）' : trainStep === 2 ? 'B × C × D × H × W' : '保存中间激活并更新参数'}</span></div>
          <div className="training-volume hr"><div className="volume-cube">{Array.from({ length: 5 }, (_, i) => <i key={i} style={{ '--layer': i, backgroundImage: `url(${i === 4 ? images.reconstructSwinirgan : images.reconstructBicubic})` } as React.CSSProperties} />)}<span>{trainStep < 2 ? 'HR 体积' : trainStep === 2 ? '训练批次' : '3D SR 输出'}</span></div><small>{trainStep < 2 ? '对应高分辨率体数据' : trainStep === 2 ? 'C=1 的灰度岩心' : 'D、H、W 各放大 r 倍'}</small></div>
        </div>
        <div className="training-facts"><div><strong>3D 卷积核</strong><span>K × K × K</span><p>同时覆盖 XY 与 Z 邻域</p></div><div><strong>配置示例</strong><span>gt_size = 128</span><p>SwinIRGAN3D ×4 配置的 HR 裁块尺寸</p></div><div><strong>小批次</strong><span>batch_size = 1</span><p>4090-friendly 配置，优先控制显存</p></div></div>
        <div className="formula-box wide"><span>PixelShuffle3D</span><strong>C·r³ → C　｜　D×H×W → rD×rH×rW</strong><p>EDSR3D 通过 3D 卷积增加通道，再用三维 PixelShuffle 将通道重排到 D、H、W 三个方向。</p></div>
      </section>

      <section id="inference" className="paper-section">
        <SectionHeading number="4" title="大岩心如何推理：分块，但不是简单切块" accent="magenta" intro={<><strong>问题：</strong>训练好的模型仍无法一次吃下完整岩心。推理时不需要反向传播，可以逐块计算；但若直接切硬边，块边界缺少邻域信息，容易出现拼接缝。解决办法是“带上下文输入，只保留中心输出”。</>} />
        <TilingDemo />
        <div className="inference-steps"><div><span>01</span><strong>定位核心块</strong><p>按 core-size 沿 Z、Y、X 遍历，核心块彼此不重叠。</p></div><div><span>02</span><strong>向外扩上下文</strong><p>各方向增加 context；体积边界处按实际范围截断。</p></div><div><span>03</span><strong>执行 3D 推理</strong><p>转为 B×C×D×H×W，可选 CUDA FP16，不计算梯度。</p></div><div><span>04</span><strong>只写回中心</strong><p>舍弃边界预测，将 SR core 写入磁盘映射输出数组。</p></div></div>
        <div className="caution"><ScanLine size={20} /><span><strong>拼接解决显存，不创造全局感知。</strong>每块仍然只看到自己的局部上下文；跨越多个块的超长孔道或全局非均质性，模型未必能完整理解。</span></div>
      </section>

      <section id="limits" className="paper-section">
        <SectionHeading number="5" title="为什么不能无限大地训练和推理？" accent="ochre" intro={<><strong>两个不同的限制：</strong>显存决定“一次能装多大的块”，感受野决定“一个输出体能利用多大范围的信息”。分块让任务可运行，却也把全局问题拆回了局部问题。</>} />
        <MemoryLab />
        <div className="limit-grid"><article><MemoryStick size={23} /><h3>显存：比体素增长更快</h3><p>输入本身按 n³ 增长；训练还要保留多层、多通道激活和梯度。GAN 训练还同时包含生成器与三维判别器。</p></article><article><Box size={23} /><h3>感受野：窗口与块尺寸有限</h3><p>3D Swin 的窗口、网络深度与裁块尺寸共同限制可见范围。增加 context 有帮助，但也会增加每块计算。</p></article><article><Boxes size={23} /><h3>输出：×4 就是 64 倍体素</h3><p>三个方向各放大 4 倍，输出数组本身就可能很大。代码采用磁盘映射写出，并支持 uint8 或 float32。</p></article></div>
      </section>

      <section id="code" className="paper-section resources-section">
        <SectionHeading number="6" title="从仓库开始复现" intro={<><strong>推荐路径：</strong>先用小立方体验证数据格式与训练，再对完整体积运行中心可信拼接。仓库同时提供 EDSR3D、ESRGAN3D、SwinIRGAN3D 配置，以及二维基线。</>} />
        <CodePanel />
        <div className="resource-list">
          <a href={repo} target="_blank" rel="noreferrer"><Github size={24} /><span><strong>PoreBoostGAN_3DSR</strong><small>三维网络、体数据集、裁块与完整体积推理</small></span><ExternalLink size={17} /></a>
          <a href={`${repo}/blob/HEAD/tools/infer_3d_volume_reconstruct.py`} target="_blank" rel="noreferrer"><FileCode2 size={24} /><span><strong>查看中心可信拼接源码</strong><small>tools/infer_3d_volume_reconstruct.py</small></span><ExternalLink size={17} /></a>
          <a href={repo2d} target="_blank" rel="noreferrer"><Layers3 size={24} /><span><strong>PoreBoostGAN 主项目</strong><small>二维模型、论文、配置与相关实验</small></span><ExternalLink size={17} /></a>
          <a href="https://data.mendeley.com/datasets/6kvtfb5kts/1" target="_blank" rel="noreferrer"><Database size={24} /><span><strong>开放三维 TIFF 数据</strong><small>生物成因碳酸盐岩与 MRCCM 数据 · Mendeley Data</small></span><ExternalLink size={17} /></a>
        </div>
      </section>
    </main>

    <footer><div><strong>PoreBoostGAN · 3DSR</strong><span>从二维切片到三维体素的交互式技术科普</span></div><p>页面中的孔道、裁块与显存演示为教学示意；训练参数和推理流程依据公开仓库代码与配置。岩石图像来自 Meng et al. (2026)，CC BY 4.0。</p><a href={repo} target="_blank" rel="noreferrer">GitHub <ExternalLink size={12} /></a></footer>
  </>
}

export default App
