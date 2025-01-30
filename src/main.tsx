// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CustomThemeProvider from './components/context/Customthemeprovider.tsx';
import { SidebarProvider } from './components/context/Togglecontext.tsx';
import { WalletProvider } from './components/context/Walletcontext.tsx';
import { IndexProvider } from './components/context/Indexcontext.tsx';

createRoot(document.getElementById('root')!).render(
  <CustomThemeProvider>
      <SidebarProvider>
      <IndexProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
      </IndexProvider>
      </SidebarProvider>
  </CustomThemeProvider>
)
