// Footer.js
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 flex-wrap text-center justify-between items-center">
        <div className="w-full md:w-auto text-center mb-4 md:mb-0">
          <p>2023© VoxaLinkPro | All Rights Reserved</p>
          <p>info@voxalink.com</p>
        </div>
        <nav className="w-full md:w-auto mb-4 md:mb-0">
          <ul className="flex flex-wrap justify-center md:justify-start gap-4 font-semibold">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Whitepaper
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Win Prizes
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                How to buy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <div className="w-full md:w-auto flex justify-center md:justify-end gap-4">
          {/* Icons would go here, make sure to have the correct SVGs or font icons */}
          <a href="#" className="hover:text-white transition-colors">
            <TwitterIcon />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <TelegramIcon />
          </a>
          <Image
            src="/images/discord.png"
            width={25}
            height={10}
            className="filter grayscale-[50%] cursor-pointer"
          />
          {/* ... other icons */}
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-xs md:pb-[1rem] pb-[1rem]">
          Disclaimer: Cryptocurrency may be unregulated in your jurisdiction.
          The value of cryptocurrencies may fluctuate. Profits may be subject to
          capital gains or other taxes applicable in your jurisdiction
        </p>
      </div>
    </footer>
  );
}
