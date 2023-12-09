import React, { useState, useEffect } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import Countdown from "react-countdown";
import styles from "../styles/Input.module.css";
import { ConnectKitButton } from "connectkit";
import { ethers } from "ethers";
import { parseEther } from "viem";
import CircularProgress from "@mui/material/CircularProgress";
import LockIcon from "@mui/icons-material/Lock";
import dotenv from "dotenv";
dotenv.config();

import abi from "../../constants/abi";

const contractAddress =
  process.env
    .CONTRACT_ADDRESS; /* Your Contract Address need to change when deployed */

import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";

import { useAccount } from "wagmi";

export default function PreSaleCard() {
  //Loading bar constants
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const phaseStartDates = ["2023-11-18", "2023-12-29", "2024-01-28"]; // Array of phase start dates
  const phaseEndDates = ["2023-12-28", "2024-01-27", "2024-02-16"]; // Array of phase end dates
  const [progress, setProgress] = useState(0);

  const { address, isConnected } = useAccount();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const phaseStartDate = new Date(phaseStartDates[currentPhaseIndex]);
      const phaseEndDate = new Date(phaseEndDates[currentPhaseIndex]);
      const totalDuration = phaseEndDate - phaseStartDate;
      const timePassed = now - phaseStartDate;

      let newProgress = (timePassed / totalDuration) * 100;
      newProgress = Math.min(Math.max(newProgress, 0), 100); // Clamp between 0 and 100

      setProgress(newProgress);

      if (now >= phaseEndDate) {
        const nextIndex = currentPhaseIndex + 1;
        if (nextIndex < phaseEndDates.length) {
          setCurrentPhaseIndex(nextIndex);
          // Reset progress bar for the next phase
          setProgress(0);
        } else {
          // If it's the last phase, stop the interval
          clearInterval(interval);
        }
      }
    }, 100000);

    return () => clearInterval(interval);
  }, [currentPhaseIndex, phaseStartDates, phaseEndDates]);

  const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>Phase ended</span>;
    } else {
      // Render a countdown
      return (
        <span className="space-x-1 md:space-x-3 md:text-md text-sm">
          <span className="text-xl md:text-2xl font-bold mx-1">{days}</span>{" "}
          DAYS
          <span className="text-xl md:text-2xl font-bold mx-1">
            {hours}
          </span>{" "}
          HOURS
          <span className="text-xl md:text-2xl font-bold mx-1">
            {minutes}
          </span>{" "}
          MINUTES
          <span className="text-xl md:text-2xl font-bold mx-1">
            {seconds}
          </span>{" "}
          SECONDS
        </span>
      );
    }
  };

  const [selectedOption, setSelectedOption] = useState("USDT");
  const [currentTokenPriceUSD, setCurrentTokenPriceUSD] = useState(0.05); // Default token price in USD
  const [usdToPay, setUsdToPay] = useState("");
  const [ETHPriceUSD, setETHPriceUSD] = useState("");
  const [tokensToReceive, setTokensToReceive] = useState("");
  const [ethToPay, setEthToPay] = useState("");

  const [transactionStatus, setTransactionStatus] = useState("idle"); // idle, loading, success

  useEffect(() => {
    // Fetch ETH price when the component mounts
    const fetchETHPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setETHPriceUSD(data.ethereum.usd);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      }
    };

    fetchETHPrice();

    // Other existing useEffect code
    // ...
  }, []); // Add dependencies as needed

  const calculateEquivalent = (inputValue, inputType) => {
    let usdAmount, ethAmount, tokenAmount;

    switch (inputType) {
      case "usd":
        usdAmount = parseFloat(inputValue);
        tokenAmount = usdAmount / currentTokenPriceUSD;
        ethAmount = usdAmount / ETHPriceUSD;
        break;
      case "eth":
        ethAmount = parseFloat(inputValue);
        usdAmount = ethAmount * ETHPriceUSD;
        tokenAmount = usdAmount / currentTokenPriceUSD;
        break;
      case "token":
        tokenAmount = parseFloat(inputValue);
        usdAmount = tokenAmount * currentTokenPriceUSD;
        ethAmount = usdAmount / ETHPriceUSD;
        break;
      default:
        return;
    }

    setUsdToPay(usdAmount);
    setTokensToReceive(tokenAmount);
    setEthToPay(ethAmount);
    // Add a new state variable for ETH amount if needed
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (selectedOption === "USDT") {
      calculateEquivalent(value, "usd");
    } else if (selectedOption === "ETH") {
      calculateEquivalent(value, "eth");
    }
  };

  const handleTokenChange = (event) => {
    calculateEquivalent(event.target.value, "token");
  };

  const [tokenBalance, setTokenBalance] = useState(null);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      try {
        const balance = await readContract({
          address: contractAddress,
          abi: abi,
          functionName: "getTokenBalance",
          args: [address],
        });

        // Assuming the balance is returned as a BigNumber, convert it to a string
        setTokenBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error fetching token balance:", error);
        setTokenBalance("Error");
      }
    };

    if (isConnected) {
      fetchTokenBalance();
    }
  }, [isConnected]); // Add other dependencies as required

  const stringEthToPay = ethToPay.toString();
  console.log(stringEthToPay);

  const handleBuyClick = async () => {
    try {
      setTransactionStatus("loading"); // Set status to loading when the transaction starts
      // Prepare the contract write operation
      const config = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "buyTokens",
        value: parseEther(stringEthToPay),
        onSuccess(data) {
          setTransactionStatus("success");
          console.log("Transaction successful:", data);
          refetchTokenBalance(); // Refetch token balance after successful purchase
        },
        onError(error) {
          setTransactionStatus("idle");
          console.error("Transaction error:", error);
        },
      });

      // Execute the contract write operation
      const { hash } = await writeContract(config);
      setTransactionStatus("success");

      setTimeout(() => {
        setTransactionStatus("idle");
      }, 2000); // 2000 milliseconds = 2 seconds

      // Handle the successful transaction here
      // e.g., show a success message, update the state, etc.
    } catch (error) {
      // Handle any errors that occur during the transaction
      setTransactionStatus("idle");
      console.error("Error during the contract transaction:", error);
    }
  };

  console.log("Token Balance:", tokenBalance);

  console.log(address);

  return (
    <div className="bg-[#6664643f] p-8 rounded-xl backdrop-blur-lg shadow-xl w-full lg:w-[35rem] h-[30rem] mx-auto mt-10 text-center flex flex-col">
      <h1 className="text-white text-2xl md:text-3xl font-bold mb-4">
        $VXLP ICO Sale
      </h1>
      <div className="flex justify-center items-center h-full text-[2rem]">
        <LockIcon className="text-white text-[3rem]" />
      </div>
    </div>
  );
}
