import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClientApp } from './features/client/ClientApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientApp />
  </StrictMode>,
)