/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, Fragment } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Button } from '@mui/material';
// import { toast } from 'react-toastify';

export default function TransactionHistory({ publicKey }: { publicKey: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
  const url = import.meta.env.VITE_SOLANA_API
  const connection = new Connection(url, "confirmed");

  const fetchTransactionHistory = async (publicKey: string, numTx: number) => {
    setIsLoading(true);
    try {
      const pubKey = new PublicKey(publicKey);
      const transactionList = await connection.getSignaturesForAddress(pubKey, { limit: numTx });
      const transactionsWithAmount = await Promise.all(
        transactionList.map(async (tx) => {
          const confirmedTx = await connection.getConfirmedTransaction(tx.signature, "confirmed");
  
          if (!confirmedTx) return { ...tx, amount: "N/A" };
          const preBalance = confirmedTx.meta?.preBalances?.[0] || 0;
          const postBalance = confirmedTx.meta?.postBalances?.[0] || 0;
          const solAmount = (preBalance - postBalance) / 1e9;
  
          return { ...tx, amount: solAmount };
        })
      );
  
      setTransactions(transactionsWithAmount);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (publicKey) {
      fetchTransactionHistory(publicKey, 5);
    }
  }, [publicKey]);

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
        History
      </Button>
        <div
          ref={sidebarRef}
          aria-hidden={!isOpen}
          className={`fixed top-0 overflow-auto right-0 h-full dark:bg-neutral-800 dark:text-white bg-white shadow-2xl rounded-l-xl p-8 transform transition-transform ease-in-out ${
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
          <div className="pt-6 ">
            <h1 className="text-4xl font-semibold pt-4">Transaction History</h1>
            <p className="text-xl mb-4">View your recent transactions below!</p>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p>No transactions found.</p>
                ) : (
                  transactions.map((tx, index) => (
                    <div key={index} className="p-4 border border-gray-300 rounded-lg">
                      <p className="text-lg font-semibold">Transaction {index + 1}</p>
                      <p>BlockTime: {tx.blockTime}</p>
                      <p className='truncate w-68'>Signature: {tx.signature}</p>
                      <p>Status: {tx.confirmationStatus}</p>
                      <p>
                        Amount: {tx.amount} SOL
                      </p>
                      <p>Slot: {tx.slot}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
