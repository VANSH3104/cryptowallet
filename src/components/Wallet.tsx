import useIndex from "./context/Indexcontext";
import { useWallet } from "./context/Walletcontext";
import { MdDelete } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { useSidebar } from "./context/Togglecontext";
import { useEffect, useRef } from "react";
export default function Wallets() {
  const { wallets, deleteWallet } = useWallet();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_index, changeIndex] = useIndex();

  const handleWalletClick = (index: number) => {
    changeIndex(index);
    if (isSidebarOpen) {
      toggleSidebar?.();
    }
  };
   const sidebarContext = useSidebar();
  
    const toggleSidebar = sidebarContext?.toggleSidebar;
    const isSidebarOpen = sidebarContext?.isSidebarOpen;
    const sidebarRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClickOn = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
          if (isSidebarOpen) {
            toggleSidebar?.();
          }
        }
      };
  
      document.addEventListener("mousedown", handleClickOn);
      return () => {
        document.removeEventListener("mousedown", handleClickOn);
      };
    }, [isSidebarOpen, toggleSidebar]);
  return (
    <div className="p-4 ">
      <div className="space-y-2">
        {wallets.length > 0 ? (
          wallets.map((_wallet, index) => (
            <div key={index} className="p-1 rounded-lg shadow-md flex justify-between bg-gray-100 dark:bg-neutral-900">
              <button onClick={() => handleWalletClick(index)} className="flex justify-between w-full">
                <h3 className="text-lg font-semibold p-1 flex gap-2 items-center"><FaWallet/>Wallet {index + 1}</h3>
              </button>
              <button
                onClick={() => deleteWallet(index)}
                className="text-2xl"
              >
                <MdDelete />
              </button>
            </div>
          ))
        ) : (
            <></>
        )}
      </div>
    </div>
  );
}
