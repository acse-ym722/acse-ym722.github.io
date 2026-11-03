import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ThreeSrCase from './ThreeSrCase'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThreeSrCase />
  </StrictMode>,
)
