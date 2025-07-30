import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './scss/rightbar.scss'
import './assets/scss/custom/fonts/fontsgoogleapis.scss'
import 'react-toastify/dist/ReactToastify.css';

// Add error handling for deployment
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  createRoot(rootElement).render(
    // <StrictMode>
      <App />
    // </StrictMode>,
  );
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = '<div style="padding: 20px; color: red;">Failed to load application. Please refresh the page.</div>';
}
