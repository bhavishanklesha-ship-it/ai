import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure Google Search Console verification tag exists in <head>
if (!document.querySelector('meta[name="google-site-verification"]')) {
  const meta = document.createElement('meta');
  meta.name = 'google-site-verification';
  meta.content = 'Qc65MfyWkwOCnOGoOFTKAvBq7aReMlpUtEg__8KUPPE';
  document.head.appendChild(meta);
}

createRoot(document.getElementById('root')!).render(<App />);
