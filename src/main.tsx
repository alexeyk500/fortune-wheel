import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import PageLuckyWheel from "./pages/PageLuckyWheel/PageLuckyWheel.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PageLuckyWheel />
  </StrictMode>,
)
