import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
    window.Buffer = Buffer;
}

export const EthWallet = ({mnemonic}: {mnemonic: string}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wallets, setWallets] = useState([]);

    return (
        <div>
            <button
                onClick={async function () {
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

                    setCurrentIndex(currentIndex + 1);
                    setWallets([
                        ...wallets,
                        {
                            address: wallet.address,
                            privateKey: privateKey,
                            publicKey: publicKey,
                        },
                    ]);
                }}
            >
                Add ETH Wallet
            </button>

            {wallets.map((wallet, index) => (
                <div key={index}>
                    <p><strong>ETH Address:</strong> {wallet.address}</p>
                    <p><strong>Private Key:</strong> {wallet.privateKey}</p>
                    <p><strong>Public Key:</strong> {wallet.publicKey}</p>
                </div>
            ))}
        </div>
    );
};
