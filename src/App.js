import React, { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import wavePortalABI from "./util/WavePortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const inputRef = useRef("");
  const contractAddress = "0xa7eD6D0e623683744aDb668870f9858055267520";
  const contractABI = wavePortalABI.abi;

  const getEthWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Please setup Metamask!");
      return null;
    } else {
      console.log("Ethereum Object", ethereum);
      return ethereum;
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const ethereum = getEthWallet();
      if (!ethereum) return;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an Authorized Account", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const ethereum = getEthWallet();
      if (!ethereum) return;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getWavePortalContract = () => {
    try {
      const ethereum = getEthWallet();
      if (!ethereum) return;

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      return new ethers.Contract(contractAddress, contractABI, signer);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const inputMessage = inputRef.current.value;
      if (!inputMessage.trim()) return;
      inputRef.current.value = "";

      const wavePortalContract = getWavePortalContract();

      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved Total Wave Count: ", count.toNumber());

      const waveTxn = await wavePortalContract.wave(inputMessage);
      console.log("Mining . . ", waveTxn.hash);
      const txnReceipt = await waveTxn.wait();
      console.log("Mined!");
      const newWave = txnReceipt.events[0].args;
      setAllWaves((currentWaves) => {
        return [
          {
            address: newWave.from,
            timestamp: new Date(newWave.timestamp * 1000),
            message: newWave.message,
          },
          ...currentWaves,
        ];
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllWaves = async () => {
    try {
      checkIfWalletIsConnected();
      if (!currentAccount) return;

      const wavePortalContract = getWavePortalContract();

      const waves = await wavePortalContract.getAllWaves();

      let wavesCleaned = [];
      waves.forEach((wave) => {
        wavesCleaned.unshift({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        });
      });

      setAllWaves(wavesCleaned);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllWaves();
  }, [currentAccount]);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">
          Hi, I'm building a decentralized application. Connect your Ethereum
          wallet and wave at me!
        </div>

        <textarea
          className="messageInput"
          placeholder="Type your message"
          ref={inputRef}
        ></textarea>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "OldLace",
                marginTop: "16px",
                padding: "8px",
              }}
            >
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
