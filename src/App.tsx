import { GetMnemonics, UseMnemonics } from "./components/Getmnemonics "
import { EthWallet } from "./components/GettingEthWallet";
import { SolanaWallet } from "./components/GettingsolanaWallet";


function App() {
  const {mnemonic} = UseMnemonics();
  return (
    <>
      <div>
          <GetMnemonics/>
          <SolanaWallet mnemonic={`${mnemonic}`} />
          <EthWallet mnemonic={`${mnemonic}`} />
          {/* <div>
            {mnemonic? (<GetSolWallet mnemonic={mnemonic} />):(<p className="text-gray-500">Generate a mnemonic to see the wallet generator.</p>)}
          </div> */}
      </div>
    </>
  )
}

export default App
