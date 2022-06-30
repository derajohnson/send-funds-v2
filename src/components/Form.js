import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../utils/SendFunds.json";
import { parseEther } from "ethers/lib/utils";
import Transaction from "./Transactions";
import "./Form.css";

const Form = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [allTxns, setAllTxns] = useState([]);
  const [isTxn, setIsTxn] = useState(false);

  const contractAddress = "0x0FB172Db7Ab332f3ea5189C4A3659720124880Bc";
  const contractABI = abi.abi;
  const sendFunds = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const sendFundsContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const sendFundsTxn = await sendFundsContract.sendFunds(
          walletAddress,
          ethers.utils.parseEther(amount),
          { gasLimit: 300000, value: parseEther(amount) }
        );
        await sendFundsTxn.wait();
        setWalletAddress('')
        setAmount('')
      } else {
        console.log("ethereum object does not exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendFunds();
  };

  const getAllTransactions = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const sendFundsContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let getAllTxn = await sendFundsContract.getAllTxn();
        setIsTxn(true);

        let txns = [];
        getAllTxn.forEach((txn) => {
          txns.push({
            address: txn.reciever,
            amount: txn.amount,
            timestamp: new Date(txn.timestamp * 1000),
          });
        });
        setAllTxns(txns);
      } else {
        console.log("ethereum object does not exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, []);

  useEffect(() => {
    let sendFundsContract;
  
    const onNewTransaction = (to, amount, timestamp) => {
      console.log("New transaction", to, amount, timestamp);
      setAllTxns(prevState => [
        ...prevState,
        {
          address: to,
          amount: amount,
          timestamp: new Date(timestamp * 1000)
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      sendFundsContract = new ethers.Contract(contractAddress, contractABI, signer);
      sendFundsContract.on("NewTxn", onNewTransaction);
    }
  
    return () => {
      if (sendFundsContract) {
        sendFundsContract.off("NewTxn", onNewTransaction);
      }
    };
  }, []);

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <p>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter Wallet Address"
            required
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </p>
        <p>
          <input
            type="number"
            name=""
            id=""
            placeholder="Enter Amount"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="any"
            min="0"
          />
        </p>
        <button type="submit">Send</button>
      </form>
      <div>
        {isTxn === false ? (
          <div></div>
        ) : (
          <div>
            <Transaction allTxns={allTxns} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
