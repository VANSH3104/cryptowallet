import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { HDKey } from "micro-ed25519-hdkey";
import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";
import { MdDelete } from "react-icons/md";
import { IoCopy } from "react-icons/io5";       
if (typeof window !== "undefined") {
    window.Buffer = Buffer;
}
interface Wallet {
    publicKey: string;
    privateKey: string;
}
export const SolanaWallet = ({mnemonic}: {mnemonic: string}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleAddWallet = async () => {
        try {
            const seed = await mnemonicToSeed(mnemonic , "");
            const hd = HDKey.fromMasterSeed(seed.toString("hex"));
            const derivationPath = `m/44'/501'/${currentIndex}'/0'`;
            const keypair = Keypair.fromSeed(hd.derive(derivationPath).privateKey);
            const publicKey = keypair.publicKey.toBase58();
            const privateKey = Buffer.from(keypair.secretKey).toString("hex");
            console.log(`Solana Address: ${publicKey}`);
            console.log(`Private Key: ${privateKey}`);
            setCurrentIndex(currentIndex + 1);
            setWallets([...wallets, { publicKey, privateKey }]);
        } catch (err) {
            console.error("Failed to generate wallet:", err);
            setError("An error occurred while generating the wallet.");
        }
    };
    const handleDeleteWalletindex = (currentIndex: number)=>{
        setWallets((wallet)=>wallet.filter((_, index)=>index !==currentIndex));
        console.log(wallets)
    }
    const handleDeleteWallet = ()=>{
        localStorage.setItem("mnemonic" , "")
        window.location.reload();
    }
    return (
        <div className="">
            <div className="md:flex grid gap-2 justify-between">
                <div className="text-2xl  md:text-4xl font-bold p-2 font-sans ">
                    Solana Wallet
                </div>
                <div className="flex gap-2">   
                    <button 
                        className="bg-neutral-900 text-white p-4 font-semibold text-lg rounded-xl flex items-center justify-center dark:text-white dark:bg-neutral-900
                            sm:p-3 sm:text-base md:p-4 md:text-lg lg:p-5 lg:text-xl"
                        onClick={handleAddWallet}
                        >
                    Add Wallet
                    </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                    <button 
                        className="bg-red-500 text-white p-4 font-semibold text-lg rounded-xl flex items-center justify-center 
                            sm:p-3 sm:text-base md:p-4 md:text-lg lg:p-5 lg:text-xl"
                        onClick={handleDeleteWallet}
                        >
                        Delete Walt
                    </button>
                </div>
            </div>
            <div className="space-y-4 pt-3 dark:bg-neutral-900 bg-white mt-6 rounded-xl">
                {wallets.map((wallet, index) => (
                    <div key={index} className="p-4 rounded-lg shadow-md flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-xl md:text-3xl">Wallet {index + 1}</p>
                        <button
                          onClick={() => handleDeleteWalletindex(index)}
                        className="text-red-500 hover:text-red-700 text-2xl p-3"
                        >
                        <MdDelete />
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                        <p className="font-medium w-full sm:w-auto truncate"><strong className="text-lg">Solana Address</strong>
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
                    </div>
                ))}
            </div>
        </div>
    );
};
