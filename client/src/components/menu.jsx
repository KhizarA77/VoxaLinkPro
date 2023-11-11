"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import Hamburger from "hamburger-react";
import { ScrollContext } from "@/context/ScrollContext";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const { giftCardRef } = useContext(ScrollContext);

  const scrollToGiftCard = () => {
    if (giftCardRef && giftCardRef.current) {
      giftCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="relative z-10">
        <Hamburger
          toggled={open}
          toggle={setOpen}
          size={30}
          duration={0.5}
          color="#fff"
          className="z-10"
        />
      </div>
      {open && (
        <div className="fixed top-0 left-0 h-[100dvh] w-[100dvw] bg-black backdrop-blur-lg font-[600] text-white text-center items-center justify-center text-2xl">
          <div className="flex flex-col h-[100vh] w-[100vw] justify-center gap-8">
            <Link
              href="/"
              className="text-white"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/whitepaper"
              className="text-white"
              onClick={() => setOpen(false)}
            >
              Whitepaper
            </Link>
            <button
              href=""
              className="text-white"
              onClick={() => {
                scrollToGiftCard();
                setOpen(false); // This will close the menu
              }}
            >
              Win Prizes
            </button>
            <Link
              href="/howtobuy"
              className="text-white"
              onClick={() => setOpen(false)}
            >
              How To Buy
            </Link>
            <Link
              href="/contact"
              className="text-white"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
