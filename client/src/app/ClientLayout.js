"use client";
import React from "react";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import dotenv from "dotenv";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { ScrollProvider } from "@/context/ScrollContext";
import { mainnet, sepolia } from "wagmi/chains";

dotenv.config();

const chains = [sepolia];

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    infuraId: process.env.INFURA_ID, // or infuraId
    walletConnectProjectId: process.env.WALLET_PROJECT,
    chains,
    // Required
    appName: "VoxaLink Pro",

    // Optional
    appDescription: "Ethereum's First AI Voice  Application",
    appUrl: "http://voxalinkpro.io/", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

export default function ClientLayout({ children }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <ScrollProvider>
          <Navbar />
          {children}
          <Footer />
        </ScrollProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
