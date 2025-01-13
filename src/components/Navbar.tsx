import { Switch } from "@mui/material";
import { useContext } from "react";
import { FaWallet } from "react-icons/fa";
import { colorModeContext } from "./Customthemeprovider";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
const handleWalletClick = () => {
    window.location.href = "https://github.com/VANSH3104";
  };
export const Navbar = () => {
  const colorMode = useContext(colorModeContext);

  return (
    <div className="w-full h-[100px] bg-white dark:bg-neutral-900 text-black dark:text-white rounded-b-2xl shadow-xl flex justify-between items-center px-4 md:px-12 lg:px-[166px]">
      <div className="font-bold text-[28px] md:text-[32px] lg:text-[40px] flex items-center gap-2">
        <FaWallet onClick={handleWalletClick} /> Vwallet
      </div>
      <div className="flex">
        <div className="text-2xl p-2  ">
          <CiDark/>
        </div>
        <Switch
          color="default"
          onChange={() => colorMode()}
          inputProps={{ "aria-label": "Theme toggle" }}
          title="Toggle theme"
        />
        <div className="text-2xl p-2">
          <CiLight/>
        </div>
      </div>
    </div>
  );
};
