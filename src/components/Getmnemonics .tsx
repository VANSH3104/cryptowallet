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
            <p className="bg-black font-bold text-white">
                {mnemonic?.split("").map((char , index)=>(
                <span  className = ""key={index}>{char}</span>
            ))}</p>
            <button onClick={handleGenerateMnemonic} className="bg-red-300">Click</button>
        </div>
    );
};
