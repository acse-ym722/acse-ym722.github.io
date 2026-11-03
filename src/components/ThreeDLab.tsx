import { useEffect, useState } from 'react'
import { Box, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

const path2d = [2, 2, 3, 2, 4, 3, 5, 4]
const path3d = [2, 2, 2, 3, 3, 3, 4, 4]

function PoreSlice({ z, mode, size = 6 }: { z: number; mode: '2d' | '3d'; size?: number }) {
  const path = mode === '2d' ? path2d : path3d
  const cx = path[z], cy = 2.5 + Math.sin(z / 3) * .6
  return <div className="pore-slice" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }} aria-label={`第 ${z + 1} 层孔隙切片`}>
    {Array.from({ length: size * size }, (_, i) => {
      const x = i % size, y = Math.floor(i / size)
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      const pore = dist < 1.25
      const edge = !pore && dist < 1.75
      return <i key={i} className={pore ? 'pore' : edge ? 'edge' : ''} />
    })}
  </div>
}

export function AxisContinuity() {
  const [mode, setMode] = useState<'2d' | '3d'>('2d')
  const [z, setZ] = useState(3)
  const path = mode === '2d' ? path2d : path3d
  return <div className="axis-lab">
    <div className="lab-toolbar">
      <div><strong>Z 轴连续性实验</strong><span>教学示意 · 观察孔道中心如何跨层变化</span></div>
      <div className="segmented" role="group" aria-label="选择超分方式"><button className={mode === '2d' ? 'active' : ''} onClick={() => setMode('2d')}>2D 逐层</button><button className={mode === '3d' ? 'active' : ''} onClick={() => setMode('3d')}>3D 联合</button></div>
    </div>
    <div className="axis-stage">
      <div className="slice-stack" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <div key={i} className={z === i ? 'selected' : ''} style={{ '--layer': i } as React.CSSProperties}><PoreSlice z={i} mode={mode} /></div>)}</div>
      <div className="slice-inspector">
        <span className="voxel-title">当前 XY 切片 · Z = {z + 1}</span>
        <PoreSlice z={z} mode={mode} />
        <label htmlFor="z-range">拖动查看不同 Z 层</label>
        <input id="z-range" type="range" min="0" max="7" value={z} onChange={e => setZ(Number(e.target.value))} />
        <div className="z-ticks"><span>Z1</span><span>Z8</span></div>
      </div>
      <div className="xz-view">
        <span className="voxel-title">把 8 层竖起来看 · XZ</span>
        <div className="xz-grid">{path.map((x, iz) => <div key={iz}>{Array.from({ length: 6 }, (_, ix) => <i key={ix} className={Math.abs(ix - x) <= 1 ? 'pore' : ''} />)}</div>)}</div>
        <p>{mode === '2d' ? '每层独立预测，孔道位置可能发生跳变；Z 轴连续性需要额外多平面处理或去噪。' : '网络同时读取 D、H、W，孔道跨层变化可作为同一个三维结构来学习。'}</p>
      </div>
    </div>
    <div className={`lab-verdict ${mode}`}><strong>{mode === '2d' ? '层内清晰 ≠ 层间连续' : '三维优势：直接学习 Z 方向上下文'}</strong><span>{mode === '2d' ? '二维模型并非不能重建三维，但 Z 一致性通常是间接获得的。' : '这有利于孔道连通、裂缝延伸和三维拓扑分析。'}</span></div>
  </div>
}

export function UpsamplingLab() {
  const [mode, setMode] = useState<'2d' | '3d'>('3d')
  const [scale, setScale] = useState<2 | 4>(4)
  const factor = mode === '2d' ? scale ** 2 : scale ** 3
  return <div className="upsampling-lab">
    <div className="lab-toolbar"><div><strong>从通道到空间：PixelShuffle</strong><span>先增加通道，再把通道重排成新像素／体素</span></div><div className="segmented"><button className={mode === '2d' ? 'active' : ''} onClick={() => setMode('2d')}>2D</button><button className={mode === '3d' ? 'active' : ''} onClick={() => setMode('3d')}>3D</button></div></div>
    <div className="shuffle-stage">
      <div className="shuffle-tensor"><span>低分特征</span><strong>{mode === '2d' ? 'C × H × W' : 'C × D × H × W'}</strong><div className="mini-cube"><Box size={38} /></div></div>
      <div className="shuffle-arrow">→<span>通道扩为 r{mode === '2d' ? '²' : '³'} 倍</span></div>
      <div className="shuffle-tensor channels"><span>待重排通道</span><strong>{factor}C</strong><div className="channel-dots">{Array.from({ length: Math.min(factor, 16) }, (_, i) => <i key={i} />)}</div></div>
      <div className="shuffle-arrow">→<span>PixelShuffle{mode}</span></div>
      <div className="shuffle-tensor output"><span>高分输出</span><strong>{mode === '2d' ? `${scale}H × ${scale}W` : `${scale}D × ${scale}H × ${scale}W`}</strong><small>空间数据量 ×{factor}</small></div>
    </div>
    <div className="scale-control"><span>超分倍率 r</span><div className="segmented"><button className={scale === 2 ? 'active' : ''} onClick={() => setScale(2)}>×2</button><button className={scale === 4 ? 'active' : ''} onClick={() => setScale(4)}>×4</button></div><p>{mode === '3d' ? `三维 ×${scale}：每个方向都放大，体素数变为 ${factor} 倍。` : `二维 ×${scale}：像素数变为 ${factor} 倍。`}</p></div>
  </div>
}

export function TilingDemo() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setActive(v => (v + 1) % 16), 900)
    return () => window.clearInterval(timer)
  }, [playing])
  return <div className="tiling-lab">
    <div className="lab-toolbar"><div><strong>中心可信拼接</strong><span>为便于观察，将 Z／Y／X 三维块阵列展开成平面</span></div><div className="stepper-controls"><button className="control-dark" onClick={() => setPlaying(v => !v)}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? '暂停' : '播放'}</button><button className="control-light" onClick={() => { setPlaying(false); setActive(v => (v + 15) % 16) }} aria-label="上一个块"><ChevronLeft size={16} /></button><button className="control-light" onClick={() => { setPlaying(false); setActive(v => (v + 1) % 16) }} aria-label="下一个块"><ChevronRight size={16} /></button></div></div>
    <div className="tiling-stage">
      <div className="block-field">{Array.from({ length: 16 }, (_, i) => <button key={i} className={`${i === active ? 'active' : ''} ${i < active ? 'done' : ''}`} onClick={() => { setPlaying(false); setActive(i) }} aria-label={`查看第 ${i + 1} 个核心块`}><span>{i + 1}</span></button>)}</div>
      <div className="context-explainer">
        <div className="context-cube"><div className="context-halo"><span>上下文 16</span><div className="context-core"><strong>64³</strong><span>只写回中心核心</span></div></div></div>
        <div className="context-copy"><span className="mini-label">BLOCK {String(active + 1).padStart(2, '0')} / 16</span><h3>多算一圈，少一道缝。</h3><p>输入块向外扩展 16 个体素，让中心区域看到邻近结构。推理完成后，边界预测被舍弃，只把 64³ 核心写入最终体积。</p><div className="context-equation">输入边长 = 64＋2×16 = <strong>96</strong><span>单块输入体素 ÷ 核心体素 ≈ <strong>3.38×</strong></span></div></div>
      </div>
    </div>
    <div className="tiling-progress"><span style={{ width: `${((active + 1) / 16) * 100}%` }} /><small>已定位到第 {active + 1} 块；实际代码按 Z → Y → X 三重循环遍历。</small></div>
  </div>
}

const sizes = [16, 32, 64, 96, 128, 256]
export function MemoryLab() {
  const [index, setIndex] = useState(2)
  const [scale, setScale] = useState<2 | 4>(4)
  const [context, setContext] = useState(16)
  const n = sizes[index]
  const mib2d = n * n * 4 / 1024 ** 2
  const mib3d = n ** 3 * 4 / 1024 ** 2
  const outMib = mib3d * scale ** 3
  const contextN = 64 + context * 2
  return <div className="memory-lab">
    <div className="memory-controls">
      <label htmlFor="cube-size">单通道输入边长 <strong>{n}³</strong></label>
      <input id="cube-size" type="range" min="0" max={sizes.length - 1} value={index} onChange={e => setIndex(Number(e.target.value))} />
      <div className="memory-size-labels">{sizes.map(s => <span key={s}>{s}</span>)}</div>
      <div className="memory-mode"><span>超分倍率</span><div className="segmented"><button className={scale === 2 ? 'active' : ''} onClick={() => setScale(2)}>×2</button><button className={scale === 4 ? 'active' : ''} onClick={() => setScale(4)}>×4</button></div></div>
    </div>
    <div className="memory-chart">
      <div className="memory-row"><span>二维张量 n²</span><div><i style={{ width: `${Math.max(2, mib2d / mib3d * 100)}%` }} /></div><strong>{mib2d < 1 ? mib2d.toFixed(3) : mib2d.toFixed(1)} MiB</strong></div>
      <div className="memory-row three"><span>三维张量 n³</span><div><i style={{ width: '100%' }} /></div><strong>{mib3d < 1 ? mib3d.toFixed(3) : mib3d.toFixed(1)} MiB</strong></div>
      <div className="memory-output"><span>仅输出体数据（单通道 FP32）</span><strong>{outMib < 1 ? outMib.toFixed(2) : outMib.toFixed(1)} MiB</strong><small>×{scale} 三维超分 = 输入体素的 {scale ** 3} 倍</small></div>
    </div>
    <p className="demo-note">这里只计算一张单通道 FP32 张量，便于建立尺度直觉。真实训练还需保存多通道、多层激活、梯度与优化器状态，显存需求会显著更高。</p>
    <div className="receptive-lab">
      <div><span className="mini-label">RECEPTIVE FIELD TRADE-OFF</span><h3>上下文越大，边界更稳；但整块计算也更贵。</h3><p>核心块固定为 64³。调节外侧上下文，观察单块输入增长。它能扩大局部可见范围，却仍不等于整颗岩心的全局感受野。</p></div>
      <div className="receptive-controls"><label htmlFor="context-size">上下文：{context} 体素／侧</label><input id="context-size" type="range" min="0" max="32" step="8" value={context} onChange={e => setContext(Number(e.target.value))} /><div className="receptive-numbers"><span>输入 {contextN}³</span><strong>核心体积的 {(contextN ** 3 / 64 ** 3).toFixed(2)}×</strong></div></div>
    </div>
  </div>
}
