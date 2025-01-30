import { useEffect, useRef } from "react";
import { useSidebar } from "./context/Togglecontext";
import Wallets from "./Wallet";


export const Sidebar = () => {
  const sidebarContext = useSidebar();

  const toggleSidebar = sidebarContext?.toggleSidebar;
  const isSidebarOpen = sidebarContext?.isSidebarOpen;
  const sidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (isSidebarOpen) {
          toggleSidebar?.();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, toggleSidebar]);

  return (
    <div className="h-full flex flex-col overflow-hidden" ref={sidebarRef}>
      <div className="text-2xl font-bold p-2 ps-4">
        Wallets
      </div>
      <main className="flex-1 overflow-auto">
        <Wallets />
      </main>
    </div>
  );
};
