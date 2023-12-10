"use client";
import { useContext, useEffect } from "react";
import Link from "next/link";
import Menu from "./menu";
import { ScrollContext } from "@/context/ScrollContext";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { signMessage } from "@wagmi/core";

const Navbar = () => {
  const preSaleCardRef = useContext(ScrollContext);
  const { isConnected, address } = useAccount();

  const connectWallet = async () => {
    const storedAddress = localStorage.getItem("connectedWalletAddress");
    console.log("Stored wallet address:", storedAddress);

    if (isConnected && address && storedAddress !== address) {
      console.log("Attempting to connect wallet...");

      try {
        const nonceResponse = await fetch(
          `https://voxalink-express-backend-664eb2bf22f3.herokuapp.com/api/wallet/getNonce?walletAddress=${address}`
        );
        const nonceData = await nonceResponse.json();

        const signatureData = await signMessage({ message: nonceData.nonce });

        if (signatureData) {
          const payload = {
            walletAddress: address,
            nonce: nonceData.nonce,
            signature: signatureData,
          };
          const verifyResponse = await fetch(
            "https://voxalink-express-backend-664eb2bf22f3.herokuapp.com/api/wallet/connect",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
          const verifyStatus = verifyResponse.status;

          if (verifyStatus === 200) {
            console.log("Wallet connected and verified successfully.");
            localStorage.setItem("connectedWalletAddress", address);
          } else {
            console.error("Error: Wallet connection failed.");
          }
        } else {
          console.error("Signature process was not completed.");
        }
      } catch (error) {
        console.error("Catch block Error:", error);
      }
    } else {
      console.log("Skipping wallet connection process or already connected.");
    }
  };

  useEffect(() => {
    console.log("useEffect triggered. isConnected:", isConnected, "address:", address);
    if (!isConnected) {
      localStorage.removeItem("connectedWalletAddress");
      console.log("Wallet disconnected, local storage cleared.");
    } else {
      connectWallet();
    }
  }, [isConnected, address]);

  const scrollToPreSaleCard = () => {
    if (preSaleCardRef && preSaleCardRef.current) {
      preSaleCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="bg-[#6664649f] backdrop-blur-md p-3 md:p-4 fixed w-full"
      style={{ zIndex: 5 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="lg:hidden">
            <Menu />
          </div>
          <Link href="/">
            <img
              src="/images/navlogo.png"
              className="md:w-[250px] w-[180px] transform -translate-x-2"
              alt="Logo"
            />
          </Link>
          <div className="hidden lg:flex space-x-8 ml-10 text-md">
            <Link href="/" className="text-white">
              Home
            </Link>
            <Link
              href="https://docsend.com/view/udmsw2jatjwwzxfa"
              className="text-white"
              target="_blank"
            >
              Whitepaper
            </Link>
            <Link href="/contact" className="text-white">
              Contact
            </Link>
          </div>
        </div>
        <div className="flex gap-6 lg:gap-6">
          <div>
            <ConnectKitButton />
          </div>
          <button
            className="bg-pink-500 hover:bg-pink-800 text-md hidden md:block text-white px-5 py-[0.1rem] md:py-[0.09rem] rounded-xl mr-4 h-10"
            onClick={scrollToPreSaleCard}
          >
            Buy $VXLP
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
