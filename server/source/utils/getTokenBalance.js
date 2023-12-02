import { readContract } from "@wagmi/core";
import abi from './abi.js';
import logger from '../logger.js'

import { mainnet, sepolia } from "wagmi/chains";
import { createConfig } from "wagmi";
import { getDefaultConfig } from "connectkit";

const contractAddress = '0xf1b01b47Aff62B1768d053AbcFe9497dc80B0016';

const chains = [sepolia];


const config = createConfig(
    getDefaultConfig({
      // Required API Keys
      infuraId: "cc759978ac1544e084dfbcffd7498400", // or infuraId
      walletConnectProjectId: "6b49792029eb24adfa1aff3e1868073c",
      chains,
      // Required
      appName: "Voxa Link Pro",
  
      // Optional
      appDescription: "Ethereum's First AI Voice  Application",
      appUrl: "http://voxalinkpro.io/", // your app's url
      appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    })
  );

export const getTokenBalance = async (address) => {
    try {
        const fetchData = await readContract({
            address: contractAddress,
            abi,
            functionName: "getTokenBalance",
            args: [address],
        })


        const balance  = Number(fetchData / BigInt(10 ** 18));

        logger.info(`Balance of ${address} is ${balance}`);
        return balance;
        

    } catch (error) {
        logger.error(error);
        return null;
    }
}