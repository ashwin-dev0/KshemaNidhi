import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { FundProvider } from './store/fundStore'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FundProvider>
        <App />
      </FundProvider>
    </BrowserRouter>
  </StrictMode>,
)
