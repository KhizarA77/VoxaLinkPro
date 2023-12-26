import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Image from "next/image";
import Link from "next/link";

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
                <Link
                  href="https://docsend.com/view/udmsw2jatjwwzxfa"
                  target="_blank"
                >
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link
                  href="https://docsend.com/view/sqayi93w7egrec6x"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="https://docsend.com/view/rpydwt3ih4452igc"
                  target="_blank"
                >
                  ToS
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.academy.voxalinkpro.io/"
                  target="_blank"
                >
                  Academy
                </Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          {/* Disclaimer */}
          <div className="text-center my-4">
            <p className="text-xs">
              Disclaimer: Cryptocurrency may be unregulated in your
              jurisdiction. The value of cryptocurrencies may fluctuate. Profits
              may be subject to capital gains or other taxes applicable in your
              jurisdiction.
            </p>
          </div>

          {/* Divider */}
          <hr className="border-gray-600 w-full my-4" />

          {/* Copyright and contact info */}
          <div>
            <p className="mb-4">
              {currentYear} © VoxaLinkPro | All Rights Reserved
            </p>
            <a href="mailto:info@voxalinkpro.io">
              <p>info@voxalinkpro.io</p>
            </a>
          </div>

          {/* Social icons */}
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="https://twitter.com/VXLPOfficial"
              className="hover:text-white transition-colors"
              target="_blank"
            >
              <TwitterIcon />
            </a>
            <a
              href="https://t.me/voxalinkpro"
              className="hover:text-white transition-colors"
              target="_blank"
            >
              <TelegramIcon />
            </a>
            <a
              href="https://discord.gg/3zuyweZubh"
              className="hover:text-white transition-colors"
              target="_blank"
            >
              <Image
                src="/Icons/discord.png"
                alt="Discord"
                width={25}
                height={25}
                className="filter grayscale-[50%] hover:grayscale-0 transition-colors"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/voxalinkpro"
              className="hover:text-white transition-colors"
              target="_blank"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://www.instagram.com/voxalinkpro/"
              className="hover:text-white transition-colors"
              target="_blank"
            >
              <InstagramIcon />
            </a>
            {/* ... other icons */}
          </div>
        </div>
      </footer>
    </>
  );
}
