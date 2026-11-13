import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { FundProvider } from './store/fundStore'
import './styles.css'
import { DialogProvider } from './components/ui/DialogProvider'
import { AuthProvider } from './features/auth/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FundProvider><DialogProvider><App /></DialogProvider></FundProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
