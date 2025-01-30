import { PiSidebarSimpleBold } from "react-icons/pi";
import { useSidebar } from "./components/context/Togglecontext";
import { GetMnemonics } from "./components/Getmnemonics ";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
export interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}
function App() {
  const sidebarContext = useSidebar();
  if (!sidebarContext) {
    return <div>Error: Sidebar context is not available</div>;
  }
  const { isSidebarOpen, toggleSidebar }: SidebarContextType = sidebarContext;

  return (
    <div className="dark:bg-black dark:text-white">
      <header className="fixed top-0 w-full z-50 bg-blue-50 text-purple-700 shadow-md dark:bg-neutral-900 dark:text-white">
        <Navbar />
        <button
          onClick={toggleSidebar}
          type="button"
          className={`absolute inline-flex items-center p-2 mt-2 ms-3 text-sm rounded-lg sm:hidden hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ${
            isSidebarOpen ? "hidden" : "block"
          }`}
        >
          <PiSidebarSimpleBold className="text-3xl" />
        </button>
      </header>
      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed pt-24 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100 text-gray-800 rounded-r-2xl shadow-2xl dark:bg-neutral-800 dark:text-gray-300">
          <Sidebar />
        </div>
      </aside>
      <main className="pt-20 sm:ml-64">
        <div className="p-4">
          <div className="p-4 h-screen rounded-lg bg-white dark:bg-neutral-800 dark:border-gray-700">
            <GetMnemonics />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
