import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Input } from '@mui/material';
import { forwardRef, Fragment, useEffect, useState } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import { ethers } from "ethers";  // Import ethers.js for Ethereum interaction

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface EthereumType {
  senderPrivateKey: string;
  publicKey: string;
}

export default function EthereumSend({ senderPrivateKey, publicKey }: EthereumType) {
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const link = import.meta.env.VITE_ETHEREUM_API;
  async function handleTransfer() {
    if (amount <= 0) {
      toast.error("Insufficient funds for the transaction.");
      return;
    }

    const provider = new ethers.JsonRpcProvider(link);
    const wallet = new ethers.Wallet(senderPrivateKey, provider);
    const weiAmount = ethers.parseEther(balance.toString());

    try {
      const tx = await wallet.sendTransaction({
        to: recipient,
        value: weiAmount
      });

      toast.success(`Transaction successful: ${tx.hash}`);
    } catch (error) {
      toast.error("Transaction failed.");
      console.error("Transaction Error:", error);
    }
  }

  useEffect(() => {
    const fetchAmount = async () => {
      const amount = await axios.post(`${link}`, {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_getBalance",
        "params": [publicKey, "latest"]
      });

      const balanceInWei = parseInt(amount.data.result, 16);
      const balanceInEth = ethers.formatEther(balanceInWei);
      setAmount(parseFloat(balanceInEth));
    };
    fetchAmount();
  }, [link, publicKey]);

  return (
    <Fragment>
      <Button
        sx={{
          borderRadius: 2,
          padding: 1,
          fontSize: 15,
          fontWeight: 'bold',
        }}
        size="large"
        className="w-40 rounded-2xl p-4"
        color="inherit"
        variant="contained"
        onClick={handleClickOpen}
      >
        Send
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Send Ethereum`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div>
              <div className='flex gap-5'>
                <div>
                  Current Balance:
                </div>
                <div className='text-xl'>
                  {amount} ETH
                </div>
              </div>
              <div>
                <div className='flex gap-4'>
                  <h1 className='pt-2'>Beneficiary Address</h1>
                  <Input
                    color='primary'
                    size='medium'
                    placeholder='Enter the Recipient Address'
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
                <div className='flex gap-4'>
                  <h1 className='pt-2'>Amount to Send</h1>
                  <Input
                    color='primary'
                    size='medium'
                    placeholder='Enter the amount'
                    onChange={(e) => setBalance(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className='pt-7 w-full items-center flex justify-center'>
                <Button color='primary' variant="contained" size='large' fullWidth onClick={() => handleTransfer()} >
                  Send
                </Button>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
