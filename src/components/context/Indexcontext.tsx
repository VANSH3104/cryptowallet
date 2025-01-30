import { createContext, useContext, ReactNode, useState } from "react";
const IndexContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>] | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export default function useIndex() {
  const context = useContext(IndexContext);
  
  if (!context) {
    throw new Error("useIndex must be used within an IndexProvider");
  }

  return context;
}
export const IndexProvider = ({ children }: { children: ReactNode }) => {
  const [index, setIndex] = useState<number>(0);
  const changeIndex = (newIndex: number | ((prevIndex: number) => number)) => {
    setIndex(newIndex);
  };

  return (
    <IndexContext.Provider value={[index, changeIndex]}>
      {children}
    </IndexContext.Provider>
  );
};
