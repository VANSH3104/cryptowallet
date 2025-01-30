import { useEffect, useState } from "react";
import { mnemonicToSeed } from "bip39";
import { HDKey } from "micro-ed25519-hdkey";
import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";
import { IoCopy } from "react-icons/io5";
import SolanaSend from "./sendcrypto";
import { useWallet } from "./context/Walletcontext";
import useIndex from "./context/Indexcontext";
import Airdrop from "./Airdrop";
import TransactionHistory from "./TransactionHistory";
import axios from "axios";

if (typeof window !== "undefined") {
    window.Buffer = Buffer;
}

export const SolanaWallet = ({ mnemonic }: { mnemonic: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const { wallets, addWallet } = useWallet();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [index, _changeIndex] = useIndex();
    const [amount, setAmount] = useState<number>(0);

    const handleAddWallet = async () => {
        try {
            const seed = await mnemonicToSeed(mnemonic, "");
            const hd = HDKey.fromMasterSeed(seed.toString("hex"));
            const derivationPath = `m/44'/501'/${currentIndex}'/0'`;
            const keypair = Keypair.fromSeed(hd.derive(derivationPath).privateKey);
            const publicKey = keypair.publicKey.toBase58();
            const privateKey = Buffer.from(keypair.secretKey).toString("hex");
            setCurrentIndex(currentIndex + 1);
            addWallet({ publicKey, privateKey });
        } catch (err) {
            console.error("Failed to generate wallet:", err);
            setError("An error occurred while generating the wallet.");
        }
    };
    
    

    const handleDeleteWallet = () => {
        localStorage.setItem("mnemonic", "");
        window.location.reload();
    };

    // Get the wallet at the current index
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
                <div className="text-xl pt-2  md:text-4xl font-bold font-sans">
                    Solana Wallet
                </div>
                <div className="flex gap-2">
                    <button
                        className="bg-[#AB47BC] text-white p-2 font-medium text-sm rounded-xl flex items-center justify-center dark:text-black dark:bg-[#CE93D8] hover:bg-[#7B1FA2] dark:hover:bg-[#AB47BC]
                        md:w-[180px] 
                            sm:p-3 sm:text-base md:p-4 md:text-lg lg:p-5 lg:text-xl"
                        onClick={handleAddWallet}
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
                <div className="space-y-4 pt-3 dark:bg-neutral-900 bg-white mt-6 rounded-xl">
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
                                <p className="font-medium w-full sm:w-auto truncate">
                                    <strong className="text-lg">Solana Address</strong>
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
                                <p className="font-medium">
                                    <strong className="text-lg">Private Key</strong>
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
                        <SolanaSend
                                        publicKey={wallet.publicKey}
                                        senderPrivateKey={Uint8Array.from(wallet.privateKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))}
                                    />
                        <Airdrop  publicKey = {wallet.publicKey}/>
                        <TransactionHistory publicKey={wallet.publicKey} />
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
