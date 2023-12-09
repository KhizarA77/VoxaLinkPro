"use client";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { Poppins } from "next/font/google";
import localFont from "@next/font/local";
import { ScrollProvider } from "@/context/ScrollContext";
import { mainnet, sepolia } from "wagmi/chains";
import { WagmiConfig, createConfig } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import dotenv from "dotenv"

dotenv.config()

const chains = [sepolia];

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

const monument = localFont({
  src: "../../public/fonts/MonumentExtended-Ultrabold.otf",
  variable: "--font-monument",
});

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    infuraId: process.env.INFURA_ID, // or infuraId
    walletConnectProjectId: process.env.WALLET_PROJECT,
    chains,
    // Required
    appName: "Voxa Link Pro",

    // Optional
    appDescription: "Ethereum's First AI Voice  Application",
    appUrl: "http://voxalinkpro.io/", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" className="light">
        <body
          className={`${poppins.className} ${monument.variable} scrollbar-thin scrollbar-thumb-[#BC96E6] scrollbar-track-[#242F40] scrollbar-rounded`}
        >
          <WagmiConfig config={config}>
            <ConnectKitProvider>
              <ScrollProvider>
                <Navbar />
                {children}
                <Footer />
              </ScrollProvider>
            </ConnectKitProvider>
          </WagmiConfig>
        </body>
      </html>
    </>
  );
}
