import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function Client() {
  return (
    <div>
      <h1>Comlink Client</h1>
      <p>This is a client instance loaded in an iframe.</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Client />
  </StrictMode>,
)