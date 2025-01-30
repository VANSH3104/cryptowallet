import { Switch } from "@mui/material";
import { useContext } from "react";
import { FaWallet } from "react-icons/fa";
import { colorModeContext } from "./context/Customthemeprovider";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
const handleWalletClick = () => {
    window.location.href = "https://github.com/VANSH3104";
  };
export const Navbar = () => {
  const colorMode = useContext(colorModeContext);

  return (
    <div className="w-full h-[80px] dark:bg-neutral-900 text-black dark:text-white rounded-b-2xl shadow-xl bg-gray-100 flex justify-between items-center px-4 md:px-12 ">
      <div className="font-bold text-[28px] md:text-[28px] lg:text-[28px] flex items-center gap-2">
        <FaWallet onClick={handleWalletClick} /> Vwallet
      </div>
      <div className="flex">
        <div className="text-xl p-2  ">
          <CiDark/>
        </div>
        <Switch
          color="default"
          onChange={() => colorMode()}
          inputProps={{ "aria-label": "Theme toggle" }}
          title="Toggle theme"
        />
        <div className="text-xl p-2">
          <CiLight/>
        </div>
      </div>
    </div>
  );
};