import React, { createContext, useContext, useState } from "react";

// Define the Wallet type
interface Wallet {
  publicKey: string;
  privateKey: string;
}

// Create the WalletContext
const WalletContext = createContext<{
  wallets: Wallet[];
  addWallet: (wallet: Wallet) => void;
  deleteWallet: (index: number) => void;
  clearWallets: () => void;
}>({
  wallets: [],
  addWallet: () => {},
  deleteWallet: () => {},
  clearWallets: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => {
  return useContext(WalletContext);
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const addWallet = (wallet: Wallet) => {
    setWallets((prevWallets) => [...prevWallets, wallet]);
  };

  const deleteWallet = (index: number) => {
    setWallets((prevWallets) => prevWallets.filter((_, i) => i !== index));
  };

  const clearWallets = () => {
    setWallets([]);
  };

  return (
    <WalletContext.Provider value={{ wallets, addWallet, deleteWallet, clearWallets }}>
      {children}
    </WalletContext.Provider>
  );
};
