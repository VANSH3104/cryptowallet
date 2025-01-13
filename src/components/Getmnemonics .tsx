import { generateMnemonic } from "bip39";
import { useLocalStorage } from "react-use";
type mnemonicType ={
    mnemonic: string | undefined,
    setMnemonic: (value: string)=>void
}
import { Buffer } from "buffer";
if (typeof window !== "undefined") {
    window.Buffer = Buffer;
}
export const UseMnemonics = ():mnemonicType=>{
    const [mnemonic , setMnemonic] = useLocalStorage<string>("mnemonic" , "")
    return {mnemonic , setMnemonic}
}
export const GetMnemonics = () => {
    const {mnemonic, setMnemonic} = UseMnemonics();

    const handleGenerateMnemonic = () => {
        const gm = generateMnemonic();
        console.log(gm);
        setMnemonic(gm);
    };

    return (
        <div>
            <div className="grid md:grid-cols-4 md:gap-3 grid-cols-2 gap-1 bg-[#13418b] p-3">
                {mnemonic?.split(" ").map((word , index)=>(
                <div
                key={index}
                className="bg-black text-white font-bold p-2 rounded text-center"
            >
                {word}
            </div>
            ))}</div>
            <button onClick={handleGenerateMnemonic} className="bg-red-300">Click</button>
        </div>
    );
};
