import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { useState } from "react";

export const GetSolWallet = ({ mnemonic }: { mnemonic: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState<string[]>([]);

    const addWallet = async () => {
        try {
            const seed = await mnemonicToSeed(mnemonic); // Wait for seed
            console.log("here" , seed)
            const path = `m/44'/501'/${currentIndex}'/0'`;
            console.log("here" , path)
            const derivedSeed = derivePath(path, seed.toString("hex")).key;
            console.log("keypair" , derivePath)
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            console.log("keypair" , keypair)
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setPublicKeys((prevKeys) => [...prevKeys, keypair.publicKey.toBase58()]);
        } catch (error) {
            console.error("Error generating wallet:", error);
        }
    };

    return (
        <div>
            <button onClick={addWallet} className="bg-blue-500 text-white p-2 rounded">
                Add Wallet
            </button>
            <div>
                {publicKeys.map((key, index) => (
                    <div key={index} className="mt-2">
                        {key}
                    </div>
                ))}
            </div>
        </div>
    );
};
