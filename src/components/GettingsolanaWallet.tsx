import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { HDKey } from "micro-ed25519-hdkey";
import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";

if (typeof window !== "undefined") {
    window.Buffer = Buffer;
}

export const SolanaWallet = ({mnemonic}: {mnemonic: string}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wallets, setWallets] = useState([]);
    const [error, setError] = useState(null);

    const handleAddWallet = async () => {
        try {
            // Generate seed from mnemonic
            const seed = await mnemonicToSeed(mnemonic , "");
            const hd = HDKey.fromMasterSeed(seed.toString("hex"));
            // Derive Solana-compatible keypair
            const derivationPath = `m/44'/501'/${currentIndex}'/0'`;
            const keypair = Keypair.fromSeed(hd.derive(derivationPath).privateKey);


            const publicKey = keypair.publicKey.toBase58();
            const privateKey = Buffer.from(keypair.secretKey).toString("hex");

            // Log keys to console
            console.log(`Solana Address: ${publicKey}`);
            console.log(`Private Key: ${privateKey}`);

            // Update state
            setCurrentIndex(currentIndex + 1);
            setWallets([...wallets, { publicKey, privateKey }]);
        } catch (err) {
            console.error("Failed to generate wallet:", err);
            setError("An error occurred while generating the wallet.");
        }
    };

    return (
        <div>
            <button onClick={handleAddWallet}>Add Solana Wallet</button>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {wallets.map((wallet, index) => (
                <div key={index}>
                    <p><strong>Solana Address:</strong> {wallet.publicKey}</p>
                    <p><strong>Private Key:</strong> {wallet.privateKey}</p>
                </div>
            ))}

            {wallets.length > 0 && (
                <button onClick={() => setWallets([])}>Clear Wallets</button>
            )}
        </div>
    );
};
