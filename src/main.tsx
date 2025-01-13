// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CustomThemeProvider from './components/Customthemeprovider';

createRoot(document.getElementById('root')!).render(
  <CustomThemeProvider>
      <App />
  </CustomThemeProvider>
)
