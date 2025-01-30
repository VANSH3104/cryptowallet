import { generateMnemonic } from "bip39";
import { useLocalStorage } from "react-use";
import { IoCopy } from "react-icons/io5";
import { Input, Button, Checkbox } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Buffer } from "buffer";
import { SolanaWallet } from "./GettingsolanaWallet";
import { EthWallet } from "./GettingEthWallet";
import { useEffect, useState } from "react";
if (typeof window !== "undefined") {
    window.Buffer = Buffer;
}

type mnemonicType = {
    mnemonic: string | undefined;
    setMnemonic: (value: string) => void;
};

export const UseMnemonics = (): mnemonicType => {
    const [mnemonic, setMnemonic] = useLocalStorage<string>("mnemonic", "");
    return { mnemonic, setMnemonic };
};

export const GetMnemonics = () => {
    const { mnemonic, setMnemonic } = UseMnemonics();
    const [crypt , setCrypt] = useState<string>("");
    const [change , setChange] = useState<boolean>(false);
    const [isBlurred, setIsBlurred] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsBlurred(true);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);
    const handleSelectCrypto = (crypto: string) => {
        setCrypt(crypto);
        toast.info(`${crypto} selected`);
    };
    
    const handleGenerateMnemonic = () => {
        setTimeout(() => {
            const gm = generateMnemonic();
            setMnemonic(gm);
            toast.success("Mnemonic generated successfully!");
          }, 2000);
        
        
    };

    const handleClipboard = () => {
        if (mnemonic) {
            navigator.clipboard.writeText(mnemonic)
                .then(() => {
                    toast.success("Mnemonic copied to clipboard!");
                })
                .catch((error) => {
                    toast.error(`Error copying mnemonic: ${error.message}`);
                });
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {mnemonic === "" ? (
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="text-2xl font-bold font-sans mb-4 text-center">
                        Generate Seed or Place Seed
                    </div>
                    <div className="flex flex-col items-center space-y-4 w-full md:w-3/4 lg:w-2/4">
                        <Input
                            value={mnemonic || ""}
                            onChange={(e) => {setMnemonic(e.target.value); window.location.reload()}}
                            placeholder="Enter or generate seed"
                            fullWidth
                            className="rounded-md shadow-lg p-3 dark:text-white"
                        />
                        <Button
                            onClick={handleGenerateMnemonic}
                            variant="contained"
                            className="w-full p-3 rounded-md shadow-md bg-gray-50 dark:bg-gray-800 dark:text-white"
                        >
                            Generate Seed
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="p-8 flex-col item-center justify-center">
                { !change && (
                    <>
                <div className="bg-white rounded-xl shadow-lg dark:bg-neutral-900 p-7 md:px-12 ">
                    <div className={`grid md:grid-cols-4 md:gap-3 grid-cols-2 gap-1 pt-5 ${isBlurred ? 'blur-sm' : ''}`}>
                        {mnemonic?.split(" ").map((word, index) => (
                            <div
                                key={index}
                                className="bg-slate-50 dark:bg-neutral-800 rounded-xl text-black dark:text-white font-bold p-2 text-center text-sm md:text-lg"
                            >
                                {word}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        <Button
                            onClick={handleClipboard}
                            color="inherit"
                            className="p-1"
                        >
                            <IoCopy className="text-xl" />
                        </Button>
                    </div>
                    <div className="flex item-center justify-center pt-7 md:gap-2 gap-1">
                        <h1 className="md:text-xl md:pt-2 pt-3 text-sm ">Save your Key First</h1>
                    <Checkbox onChange={()=>{
                        setTimeout(()=>{setChange(true)} , 2000)}} />
                    </div>
                </div>
                </>
            )}
                {mnemonic !="" && change && (
                <>
                {crypt === "" &&(<>
                <div className="pb-4 text-3xl font-bold ">
                    Choose a cryptocurrency
                </div>
                <div className="flex gap-2 ">
                <Button 
                    sx={{
                        borderRadius: 2,
                        padding:2,
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}
                    size="large"
                        className="w-40 rounded-2xl p-4"
                        color="secondary"
                        variant="contained"
                        onClick={()=>handleSelectCrypto("solana")}
                        >
                        Solana
                    </Button>
                    <Button 
                    sx={{
                        borderRadius: 2,
                        padding:2,
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}
                    size="large"
                        className="w-40 rounded-2xl p-4"
                        color="secondary"
                        variant="contained"
                        onClick={()=>handleSelectCrypto("ethereum")}
                        >
                        Ethereum
                    </Button>
                    
                </div>
                </>)}
                {crypt ==="solana" && (<>
                    <div className="">
                    <SolanaWallet mnemonic={`${mnemonic}`} />
                </div>
                </>)}
                {crypt === "ethereum" && (<>
                    <div className="">
                    <EthWallet mnemonic={`${mnemonic}`} />
                </div>
                </>)}
                </>)}
            </div>
            )}
        </>
    );
};
