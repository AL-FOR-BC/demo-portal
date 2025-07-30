import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './scss/rightbar.scss'
import './assets/scss/custom/fonts/fontsgoogleapis.scss'
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
