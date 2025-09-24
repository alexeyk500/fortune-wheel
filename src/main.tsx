import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Wheel from "./components/Wheel/Wheel.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Wheel />
  </StrictMode>,
)
