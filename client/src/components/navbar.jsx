import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Menu from "./menu";
import { ScrollContext } from "@/context/ScrollContext";
import { ConnectKitButton } from "connectkit";
import { useAccount, useSignMessage } from "wagmi";

const Navbar = () => {
  const preSaleCardRef = useContext(ScrollContext);
  const { isConnected, address } = useAccount();
  const { signMessage } = useSignMessage();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // This effect runs when the component mounts and whenever isConnected or address changes
  useEffect(() => {
    const previouslyConnected = sessionStorage.getItem("walletConnected") === "true";
    setIsWalletConnected(previouslyConnected);

    // Only attempt to connect the wallet if it was not previously connected
    if (!previouslyConnected && isConnected && address) {
      connectWallet();
    }
  }, [isConnected, address, signMessage]);

  const connectWallet = async () => {
    try {
      const nonceResponse = await fetch(`https://voxalink-express-backend-664eb2bf22f3.herokuapp.com/api/wallet/getNonce?walletAddress=${address}`);
      const nonceData = await nonceResponse.json();

      const signatureData = await signMessage({ message: nonceData.nonce });

      if (signatureData && signatureData.data) {
        const payload = {
          walletAddress: address,
          nonce: nonceData.nonce,
          signature: signatureData.data
        };

        const verifyResponse = await fetch('https://voxalink-express-backend-664eb2bf22f3.herokuapp.com/api/wallet/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (verifyResponse.ok) {
          console.log('Wallet connected and verified successfully.');
          sessionStorage.setItem("walletConnected", "true");
          setIsWalletConnected(true);
        } else {
          console.error('Error: Wallet connection failed.');
        }
      } else {
        console.error('Signature process was not completed.');
      }
    } catch (error) {
      console.error('Error in connecting wallet:', error);
    }
  };

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
          {/* MOBILE MENU */}
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
            {/* Link to Contact Page */}
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