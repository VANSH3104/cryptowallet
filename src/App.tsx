import { GetMnemonics } from "./components/Getmnemonics ";
import { Navbar } from "./components/Navbar";

function App() {
  
  return (
    <div className="flex h-screen dark:text-white dark:bg-black bg-white text-black overflow-hidden">
      <header className="fixed top-0 left-0 w-full z-10">
        <Navbar />
      </header>
      <main className="flex-grow overflow-y-auto p-4 pt-[120px]">
        <GetMnemonics />
        {/* {mnemonic !="" && (
        <>
          <div className="mt-6">
            <SolanaWallet mnemonic={`${mnemonic}`} />
          </div>
          <div className="mt-6">
            <EthWallet mnemonic={`${mnemonic}`} />
          </div>
        </>)}    */}
      </main>
    </div>
  );
}

export default App;
