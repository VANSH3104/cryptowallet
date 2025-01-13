import { GetMnemonics, UseMnemonics } from "./components/Getmnemonics ";
import { EthWallet } from "./components/GettingEthWallet";
import { SolanaWallet } from "./components/GettingsolanaWallet";
import { Navbar } from "./components/Navbar";

function App() {
  const { mnemonic } = UseMnemonics();

  return (
    <div className="flex flex-col  dark:text-white dark:bg-black bg-white text-black overflow-hidden">
      <header className="fixed top-0 left-0 w-full z-10">
        <Navbar />
      </header>
      <main className="flex-grow overflow-y-auto p-4 pt-[120px]">
        <GetMnemonics />
        <div className="mt-6">
          <SolanaWallet mnemonic={`${mnemonic}`} />
        </div>
        <div className="mt-6">
          <EthWallet mnemonic={`${mnemonic}`} />
        </div>
        {!mnemonic && (
          <p className="mt-6 text-center text-gray-500">
            Generate a mnemonic to see the wallet generator.
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
