import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ArrowLeftRight, ChevronLeft, ChevronRight, Expand, Pause, Play, X } from 'lucide-react'

export function SectionHeading({ number, title, intro, accent = 'ink' }: { number: string; title: string; intro?: ReactNode; accent?: string }) {
  return (
    <div className="section-heading">
      <h2><span className={`section-number ${accent}`}>{number}</span>{title}</h2>
      {intro && <div className={`section-intro ${accent}`}>{intro}</div>}
    </div>
  )
}

export function Metric({ value, label, note }: { value: string; label: string; note?: string }) {
  return <div className="metric"><strong>{value}</strong><span>{label}</span>{note && <small>{note}</small>}</div>
}

export function CompareSlider({ before, after, beforeLabel, afterLabel, alt }: { before: string; after: string; beforeLabel: string; afterLabel: string; alt: string }) {
  const [position, setPosition] = useState(50)
  const id = useId()
  return (
    <div className="compare-wrap">
      <div className="compare" style={{ '--position': `${position}%` } as React.CSSProperties}>
        <img className="compare-base" src={after} alt={`${alt}，${afterLabel}`} />
        <div className="compare-before"><img src={before} alt={`${alt}，${beforeLabel}`} /></div>
        <span className="compare-label left">{beforeLabel}</span>
        <span className="compare-label right">{afterLabel}</span>
        <div className="compare-divider" aria-hidden="true"><span><ArrowLeftRight size={16} /></span></div>
        <label className="sr-only" htmlFor={id}>拖动比较{beforeLabel}与{afterLabel}</label>
        <input id={id} type="range" min="0" max="100" value={position} onChange={e => setPosition(Number(e.target.value))} aria-label={`比较${beforeLabel}与${afterLabel}`} />
      </div>
      <div className="compare-hint"><ArrowLeftRight size={14} />拖动滑块，对照同一区域</div>
    </div>
  )
}

export function FigureViewer({ src, caption, children }: { src: string; caption: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey) }
  }, [open])
  return (
    <>
      <figure className="paper-figure">
        <button className="figure-open" onClick={() => setOpen(true)} aria-label={`放大查看：${caption}`}>
          <img src={src} alt={caption} loading="lazy" />
          <span><Expand size={15} />查看论文原图</span>
        </button>
        <figcaption>{caption}{children}</figcaption>
      </figure>
      {open && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false) }}>
        <div className="figure-modal" role="dialog" aria-modal="true" aria-label={caption}>
          <button ref={closeRef} className="modal-close" onClick={() => setOpen(false)} aria-label="关闭原图"><X size={20} /></button>
          <img src={src} alt={caption} />
          <p>{caption}</p>
        </div>
      </div>}
    </>
  )
}

export function Stepper({ steps, active, onChange, label }: { steps: { title: string; text: string }[]; active: number; onChange: (n: number) => void; label: string }) {
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => onChange((active + 1) % steps.length), 1800)
    return () => window.clearInterval(timer)
  }, [playing, active, onChange, steps.length])
  return (
    <div className="stepper" aria-label={label}>
      <div className="stepper-controls">
        <button className="control-dark" onClick={() => setPlaying(v => !v)}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? '暂停' : '播放'}</button>
        <button className="control-light" onClick={() => { setPlaying(false); onChange((active - 1 + steps.length) % steps.length) }} aria-label="上一步"><ChevronLeft size={16} /></button>
        <button className="control-light" onClick={() => { setPlaying(false); onChange((active + 1) % steps.length) }} aria-label="下一步"><ChevronRight size={16} /></button>
        <span>逐步查看实验流程</span>
      </div>
      <div className="step-tabs" role="tablist" aria-label={`${label}步骤`}>
        {steps.map((step, i) => <button key={step.title} role="tab" aria-selected={active === i} className={active === i ? 'active' : ''} onClick={() => { setPlaying(false); onChange(i) }}><span>{i + 1}</span>{step.title}</button>)}
      </div>
      <div className="step-copy" role="tabpanel"><strong>{steps[active].title}</strong><p>{steps[active].text}</p></div>
    </div>
  )
}

const high = Array.from({ length: 64 }, (_, i) => {
  const x = i % 8, y = Math.floor(i / 8)
  const pore = ((x - 3.5) ** 2 + (y - 3.5) ** 2 < 5.2) || (x > 5 && y < 3)
  const edge = Math.abs(Math.sqrt((x - 3.5) ** 2 + (y - 3.5) ** 2) - 2.4) < 0.75
  return pore ? 22 + ((x * 7 + y * 3) % 16) : edge ? 112 + ((x * 5 + y * 7) % 65) : 188 + ((x * 3 + y * 5) % 45)
})

export function DownsampleDemo() {
  const [mode, setMode] = useState<'point' | 'area'>('area')
  const low = Array.from({ length: 16 }, (_, i) => {
    const x = (i % 4) * 2, y = Math.floor(i / 4) * 2
    const ids = [y * 8 + x, y * 8 + x + 1, (y + 1) * 8 + x, (y + 1) * 8 + x + 1]
    return Math.round(mode === 'area' ? ids.reduce((s, n) => s + high[n], 0) / 4 : high[ids[0]])
  })
  return (
    <div className="downsample-demo">
      <div className="demo-toolbar">
        <span>教学演示：4 个体素如何变成 1 个</span>
        <div className="segmented" role="group" aria-label="选择下采样方式">
          <button className={mode === 'point' ? 'active' : ''} onClick={() => setMode('point')}>直接抽点</button>
          <button className={mode === 'area' ? 'active' : ''} onClick={() => setMode('area')}>区域平均</button>
        </div>
      </div>
      <div className="voxel-stage">
        <div><span className="voxel-title">超分后的 8 × 8</span><div className="voxel-grid high">{high.map((v, i) => <i key={i} style={{ '--v': v } as React.CSSProperties} />)}</div><small>微孔、边界与粗糙度被写入更密体素</small></div>
        <div className="aggregation-arrow" aria-hidden="true">→<span>{mode === 'area' ? '加权聚合' : '隔点取样'}</span></div>
        <div><span className="voxel-title">回到 4 × 4</span><div className="voxel-grid low">{low.map((v, i) => <i key={i} style={{ '--v': v } as React.CSSProperties} />)}</div><small>{mode === 'area' ? '灰度与覆盖率仍携带细结构影响' : '未被选中的细节直接消失'}</small></div>
      </div>
      <p className="demo-note">示意图仅解释信息聚合机制，不是论文实验数值。真实研究采用双线性插值下采样。</p>
    </div>
  )
}
