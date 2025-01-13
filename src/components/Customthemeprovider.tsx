import { createTheme, ThemeProvider } from "@mui/material";
import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const colorModeContext = createContext<() => void>(() => {});

const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
  }, [mode]);

  const colorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode: mode,
      primary: { main: mode === 'light' ? '#1976d2' : '#90caf9' },
      background: { default: mode === 'light' ? '#ffffff' : '#121212' },
      text: { primary: mode === 'light' ? '#000000' : '#ffffff' },
    },
  });

  return (
    <colorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </colorModeContext.Provider>
  );
};

export default CustomThemeProvider;
