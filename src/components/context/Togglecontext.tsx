import { createContext, useContext, ReactNode, useState } from "react";
interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
