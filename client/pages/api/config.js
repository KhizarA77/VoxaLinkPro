import { mainnet } from "wagmi/chains";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const infuraId = process.env.INFURA_ID;
const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID;
const chains = [mainnet];

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    infuraId, // or infuraId
    walletConnectProjectId,
    chains,
    // Required
    appName: "VoxaLink Pro",
  })
);
export default config;