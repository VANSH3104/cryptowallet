import { useEffect, useState } from "react";
import { mnemonicToSeed } from "bip39";
import { HDNodeWallet } from "ethers";
import { Buffer } from "buffer";
import { IoCopy } from "react-icons/io5"; 
import EthereumSend from "./sendEth";
import axios from "axios";
import useIndex from "./context/Indexcontext";
import { useWallet } from "./context/Walletcontext";
if (typeof window !== "undefined") {
    window.Buffer = Buffer;
}

export const EthWallet = ({ mnemonic }: { mnemonic: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const { wallets, addWallet } = useWallet();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [index, _changeIndex] = useIndex();
    const [amount, setAmount] = useState<number>(0);
    

    // Function to add a new Ethereum wallet
    const addEthWallet = async () => {
        try {
            const seed = await mnemonicToSeed(mnemonic);
            const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
            const hdNode = HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const privateKey = child.privateKey;
            const publicKey = child.publicKey;
            setCurrentIndex((prevIndex) => prevIndex + 1);
            addWallet({publicKey, privateKey});
        } catch (err) {
            console.error("Failed to generate wallet:", err);
            setError("An error occurred while generating the wallet.");
        }
    };
    const handleDeleteWallet = ()=>{
        localStorage.setItem("mnemonic" , "")
        window.location.reload();
    }
    const wallet = wallets[index];
    const link = import.meta.env.VITE_SOLANA_API;
    //get balance
    useEffect(() => {
        const fetchAmount = async () => {
          const amount = await axios.post(`${link}`, {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getBalance",
            "params": [`${wallet.publicKey}`]
          });
          const lamports = amount.data.result.value / 1_000_000_000;
          setAmount(lamports);
        };
        fetchAmount();
      }, [link, wallet?.publicKey]);

    return (
        <div className="">
            <div className="md:flex grid gap-2 justify-between">
                <div className="text-2xl  md:text-4xl font-bold p-2 font-sans ">
                    Ethereum Wallet
                </div>
                <div className="flex gap-2">   
                <button
                        className="bg-[#AB47BC] text-white p-2 font-medium text-sm rounded-xl flex items-center justify-center dark:text-black dark:bg-[#CE93D8] hover:bg-[#7B1FA2] dark:hover:bg-[#AB47BC]
                        md:w-[180px] 
                            sm:p-3 sm:text-base md:p-4 md:text-lg lg:p-5 lg:text-xl"
                        onClick={addEthWallet}
                    >
                        Add Wallet
                    </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button
                        className="bg-neutral-700 text-white p-2 font-semibold text-sm rounded-xl flex items-center justify-center dark:bg-neutral-500 hover:bg-neutral-500 dark:hover:bg-neutral-600
                        md:w-[180px]
                            sm:p-3 sm:text-base md:p-4 md:text-sm lg:p-5 lg:text-lg"
                        onClick={handleDeleteWallet}
                    >
                        Delete Wallet
                    </button>
                </div>
            </div>
            {wallet ? (
            <div className="space-y-4 pt-3 dark:bg-neutral-900 bg-white mt-6 rounded-xl ">
                    <div key={index} className="p-4 rounded-lg shadow-md flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                    <div className="flex items-baseline justify-between w-full">
                                <div className="font-semibold text-lg md:text-3xl pt-2 md:pt-1">
                                    Wallet {index + 1}
                                </div>
                                <div>
                                       <p className="text-lg p-2">Sol {amount}</p>
                                </div>
                            </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                        <p className="font-medium w-full sm:w-auto truncate"><strong className="text-lg">Eth Address</strong>
                        <div className="truncate text-lg pt-2">
                        {wallet.publicKey}
                        </div> 
                        </p>
                        <button
                            onClick={() => navigator.clipboard.writeText(wallet.publicKey)}
                            className="dark:text-white text-black p-4 rounded-lg text-sm"
                        >
                            <IoCopy className="text-xl" />
                        </button>
                        </div>

                        <div className="flex justify-between items-center">
                        <p className="font-medium"><strong className="text-lg">Private Key</strong> 
                            <input
                            type="password"
                            value={wallet.privateKey}
                            readOnly
                            className="dark:bg-neutral-800 mt-2 bg-white p-2 rounded-lg w-full"
                            />
                        </p>
                        <button
                            onClick={() => navigator.clipboard.writeText(wallet.privateKey)}
                            className="dark:text-white text-black p-4 rounded-lg text-sm"
                        >
                            <IoCopy className="text-xl" />
                        </button>
                        </div>
                    </div>
                    <div className="pt-4 md:flex md:gap-4 justify-center grid gap-2">
                    <EthereumSend publicKey={wallet.publicKey} senderPrivateKey={wallet.privateKey}/>        
                    </div>
                    </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        );
    };
    