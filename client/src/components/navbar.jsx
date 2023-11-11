"use client";
import Link from "next/link";
import Menu from "./menu";
import { Web3Button } from "@web3modal/react";
import { useContext, React } from "react";
import { ScrollContext } from "@/context/ScrollContext";

const Navbar = () => {
  const { preSaleCardRef } = useContext(ScrollContext);
  const { giftCardRef } = useContext(ScrollContext);

  const scrollToPreSaleCard = () => {
    if (preSaleCardRef && preSaleCardRef.current) {
      preSaleCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToGiftCard = () => {
    if (giftCardRef && giftCardRef.current) {
      giftCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-[#6664649f] backdrop-blur-md p-3 md:p-4 z-10 fixed w-full">
      <div className="flex justify-between">
        <div className="flex items-center">
          {/* MOBILE MENU  */}
          <div className="lg:hidden">
            <Menu />
          </div>
          <Link href="/">
            <div className="text-white font-bold text-xl md:text-3xl self-center">
              VoxaLink
            </div>
          </Link>
          <div className="hidden lg:flex space-x-8 ml-10 text-md self-center">
            <Link href="/" className="text-white">
              Home
            </Link>
            <Link href="/whitepaper" className="text-white">
              Whitepaper
            </Link>
            <button href="" className="text-white" onClick={scrollToGiftCard}>
              Win Prizes
            </button>
            <Link href="/contact" className="text-white">
              Contact
            </Link>
          </div>
        </div>
        <div className="flex gap-6 lg:gap-6">
          <div>
            <Web3Button />
          </div>
          <button
            className="bg-[#ffb341] hover:bg-[#dfb563] text-md hidden md:block text-black px-7 py-[0.1rem] md:py-1 rounded-3xl mr-4"
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
