import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { Buffer } from "buffer";
import { MdDelete } from "react-icons/md";
import { IoCopy } from "react-icons/io5"; 
import EthereumSend from "./sendEth";
if (typeof window !== "undefined") {
    window.Buffer = Buffer;
}

export const EthWallet = ({ mnemonic }: { mnemonic: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [wallets, setWallets] = useState<
        { address: string; privateKey: string; publicKey: string }[]
    >([]);

    // Function to add a new Ethereum wallet
    const addEthWallet = async () => {
        try {
            const seed = await mnemonicToSeed(mnemonic);
            const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
            const hdNode = HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const privateKey = child.privateKey;
            const publicKey = child.publicKey;
            const wallet = new Wallet(privateKey);

            // Log keys to console
            console.log(`Address: ${wallet.address}`);
            console.log(`Private Key: ${privateKey}`);
            console.log(`Public Key: ${publicKey}`);

            // Update state with the new wallet
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setWallets((prevWallets) => [
                ...prevWallets,
                {
                    address: wallet.address,
                    privateKey,
                    publicKey,
                },
            ]);
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
                    Ethereum Wallet
                </div>
                <div className="flex gap-2">   
                    <button 
                        className="bg-red-500 text-white p-4 font-semibold text-lg rounded-xl flex items-center justify-center dark:text-white dark:bg-red-500
                            sm:p-3 sm:text-base md:p-4 md:text-lg lg:p-5 lg:text-xl"
                        onClick={addEthWallet}
                        >
                    Add Wallet
                    </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                    <button 
                        className="bg-neutral-900 text-white p-4 font-semibold text-lg rounded-xl flex items-center justify-center 
                            sm:p-3 sm:text-base md:p-4 md:text-sm lg:p-5 lg:text-lg"
                        onClick={handleDeleteWallet}
                        >
                        Delete Wallet
                    </button>
                </div>
            </div>
            <div className="space-y-4 pt-3 dark:bg-neutral-900 bg-white mt-6 rounded-xl ">
                {wallets.map((wallet, index) => (
                    <div key={index} className="p-4 rounded-lg shadow-md flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex">
                        <p className="font-semibold text-xl md:text-3xl">Wallet {index + 1}</p>
                        <div className="pl-3"><EthereumSend publicKey={wallet.publicKey} senderPrivateKey={wallet.privateKey}/></div></div>
                        <button
                            onClick={() => handleDeleteWalletindex(index)}
                        className="text-red-500 hover:text-red-700 text-2xl p-3"
                        >
                        <MdDelete />
                        </button>
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
                    </div>
                ))}
            </div>
        </div>
    );
};
