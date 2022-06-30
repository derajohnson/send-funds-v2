import React, { useEffect, useState } from "react";
import Form from "./Form";
import "./Home.css";

function Home() {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("you need to install metamask");
      } else {
        console.log("found one", ethereum);
      }
      /*
       * Check if we're authorized to access the user's wallet
       */

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("account ", account);
        setCurrentAccount(account);
      } else {
        console.log("no authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //connect wallet with button click
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("you need to install metamask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  //truncate wallet address
  function truncate(input) {
    return input.substring(0, 5) + "..." + input.substring(38);
  }

  return (
    <div className="App">
      {currentAccount.length === 0 ? (
        <div>
          <div className="nav">
            <h1>SendFunds</h1>
          </div>
          <div className="content">
            <div>
              <p className="description">
                Send <i className="fa-brands fa-ethereum"></i> to your friends
                and family.
              </p>
              <button className="connect-btn" onClick={() => connectWallet()}>
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="nav flex">
            <h1>SendFunds</h1>
            <p className="wallet-address">{truncate(currentAccount)}</p>
          </div>
          <div className="content connected-wallet">
            <p className="description">
              Send <i className="fa-brands fa-ethereum"></i> to your friends and
              family.
            </p>
          </div>
          <div>
        <Form />
      </div>
        </div>
      )}
      
    </div>
  );
}

export default Home;
