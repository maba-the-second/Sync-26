import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TechTextTestPage from './pages/TechTextTestPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TechTextTestPage />
  </StrictMode>
);
