"use client";
import React from "react";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { ScrollProvider } from "@/context/ScrollContext";
import { mainnet, sepolia } from "wagmi/chains";
// import config from '../../pages/api/config'


const chains = [mainnet];

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    infuraId: 'c759978ac1544e084dfbcffd7498400', // or infuraId
    walletConnectProjectId: '6b49792029eb24adfa1aff3e1868073c',
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
