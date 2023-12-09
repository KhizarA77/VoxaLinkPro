import React, { useState } from "react";
import Link from "next/link";
import Hamburger from "hamburger-react";

const Menu = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative z-50">
        <Hamburger toggled={open} toggle={setOpen} size={25} duration={0.5} color="#fff" />
      </div>

      {open && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black backdrop-blur-lg font-semibold text-white text-center flex items-center justify-center text-2xl z-40">
          <div className="flex flex-col h-full w-full justify-center gap-8">
            <Link href="/">
              <span className="text-white cursor-pointer" onClick={() => setOpen(false)}>Home</span>
            </Link>
            <a href="https://docsend.com/view/udmsw2jatjwwzxfa" className="text-white" onClick={() => setOpen(false)} target="_blank" rel="noopener noreferrer">
              Whitepaper
            </a>
            <Link href="/contact">
              <span className="text-white cursor-pointer" onClick={() => setOpen(false)}>Contact</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;



