/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, Fragment } from 'react';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';

export default function Airdrop({ publicKey }: { publicKey: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null); // Store balance
  const maxRetries = 5;

  const toggleSlider = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (isOpen) {
          toggleSlider();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const airdrop = async (publicKey: string, amount: number) => {
    setIsLoading(true);
    toast.info('Processing airdrop...');
    
    for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
      try {
        const signature = await connection.requestAirdrop(new PublicKey(publicKey), amount);
        await connection.confirmTransaction(signature, "finalized");

        const updatedBalance = await connection.getBalance(new PublicKey(publicKey));
        setBalance(updatedBalance / LAMPORTS_PER_SOL);
        
        console.log("Updated Balance:", updatedBalance / LAMPORTS_PER_SOL, "SOL");
        toast.success(`Airdrop successful! New balance: ${updatedBalance / LAMPORTS_PER_SOL} SOL`);
        return; // Exit loop if successful
      } catch (error) {
        console.error(`Airdrop attempt ${retryCount + 1} failed:`, error);
        
        if (retryCount < maxRetries - 1) {
          const delayMs = Math.pow(2, retryCount) * 1000;
          console.log(`Retrying in ${delayMs / 1000} seconds...`);
          await delay(delayMs);
        } else {
          toast.error("Airdrop failed after multiple attempts.");
        }
      }
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0) {
      airdrop(publicKey, amount * LAMPORTS_PER_SOL);
    } else {
      toast.error('Please enter a valid amount.');
    }
  };

  return (
    <Fragment>
      <div className="relative">
      <Button
        sx={{
          borderRadius: 2,
          padding: 1,
          fontSize: 15,
          fontWeight: 'bold',
        }}
        size="large"
        className="w-40 rounded-2xl p-4"
        color="secondary"
        variant="contained"
        onClick={toggleSlider}
      >
        Airdrop
      </Button>
        <div
          ref={sidebarRef}
          aria-hidden={!isOpen}
          className={`fixed top-0 right-0 h-full dark:bg-neutral-800 dark:text-white bg-white shadow-2xl rounded-l-xl p-8 transform transition-transform ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ width: '380px', zIndex: 9999 }}
        >
          <button
            onClick={toggleSlider}
            className="absolute top-4 left-4 items-center flex justify-center p-2 px-4 bg-gray-300 dark:bg-neutral-600 rounded-full hover:bg-gray-400 dark:hover:bg-neutral-500"
          >
            X
          </button>
          <div className="pt-6">
            <h1 className="text-4xl font-semibold pt-4">Airdrop</h1>
            <p className="text-xl mb-4">Claim your free Drop below!</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-2 p-2 w-full border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                  placeholder="Enter amount of SOL"
                />
              </div>
              <button
                type="submit"
                onClick={toggleSlider}
                className="w-full bg-[#AB47BC] text-white py-2 rounded-lg mt-4 hover:bg-[#7B1FA2] focus:outline-none transform dark:text-black transition-transform hover:scale-105 dark:bg-[#CE93D8] dark:hover:bg-[#AB47BC]"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Claim Airdrop'}
              </button>
            </form>
            {balance !== null && (
              <p className="mt-4 text-lg font-semibold text-green-500">
                Updated Balance: {balance} SOL
              </p>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
