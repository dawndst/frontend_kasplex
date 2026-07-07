import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@/styles/antd-theme.less'
import '@/styles/tailwind.css'

createRoot(document.getElementById('root')!).render(
  <App />
)
