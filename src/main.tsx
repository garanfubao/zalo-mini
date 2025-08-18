import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

// Ensure a mount node exists. Zalo Mini App may execute the bundle without
// injecting the usual <div id="root" /> from index.html, which would cause
// React to throw "Target container is not a DOM element" (error #299).
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
