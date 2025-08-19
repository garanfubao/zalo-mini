import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

// Chỉ bật eruda nếu ENV cho phép
if (import.meta.env.DEV && process.env.ENABLE_ERUDA === 'true') {
  const script = document.createElement('script')
  script.src =
    'https://miniapp.zaloplatforms.com/debugger/eruda-3.0.0-zmp.min.js'
  script.onload = () => (window as any).eruda?.init?.()
  document.head.appendChild(script)
}

// Ensure a mount node exists
const root =
  document.getElementById('root') ??
  (() => {
    const el = document.createElement('div')
    el.id = 'root'
    document.body.appendChild(el)
    return el
  })()

createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
