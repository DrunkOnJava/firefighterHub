import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'flowbite-react';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { materialMTheme } from './utils/materialMTheme';
import './index.css';
import './styles/materialM.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary componentName="Application">
      <AuthProvider>
        <ThemeProvider theme={materialMTheme}>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
