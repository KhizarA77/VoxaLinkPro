import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-black text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col text-center items-center">
          {/* Navigation links */}
          <nav className="mb-4">
            <ul className="flex flex-wrap justify-center gap-4 font-semibold">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="https://docsend.com/view/udmsw2jatjwwzxfa">Whitepaper</Link>
              </li>
              <li>
                <Link href="https://docsend.com/view/sqayi93w7egrec6x">Privacy Policy</Link>
              </li>
              <li>
                <Link href="https://docsend.com/view/rpydwt3ih4452igc">ToS</Link>
              </li>
              <li>
                <Link href="/academy">Academy</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          {/* Disclaimer */}
          <div className="text-center my-4">
            <p className="text-xs">
              Disclaimer: Cryptocurrency may be unregulated in your jurisdiction.
              The value of cryptocurrencies may fluctuate. Profits may be subject
              to capital gains or other taxes applicable in your jurisdiction.
            </p>
          </div>

          {/* Divider */}
          <hr className="border-gray-600 w-full my-4" />

          {/* Copyright and contact info */}
          <div>
            <p className="mb-4">
              {currentYear} © VoxaLinkPro | All Rights Reserved
            </p>
            <p>info@voxalinkpro.io</p>
          </div>

          {/* Social icons */}
          <div className="flex justify-center gap-4 mt-4">
            <a href="https://twitter.com/VoxaLinkPro" className="hover:text-white transition-colors">
              <TwitterIcon />
            </a>
            <a href="https://t.me/voxalinkpro" className="hover:text-white transition-colors">
              <TelegramIcon />
            </a>
            <a href="https://discord.gg/3zuyweZubh" className="hover:text-white transition-colors">
              <Image
                src="/images/discord.png"
                alt="Discord"
                width={25}
                height={25}
                className="filter grayscale-[50%] hover:grayscale-0 transition-colors"
              />
            </a>
            {/* ... other icons */}
          </div>
        </div>
      </footer>
    </>
  );
}



