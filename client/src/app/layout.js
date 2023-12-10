import "./globals.css";
import React from "react";
import ServerLayout from "./ServerLayout"; // Importing ServerLayout
import ClientLayout from "./ClientLayout"; // Importing ClientLayout
import icoverimage from "../../public/images/VoxaLinkCover.png";

export const metadata = {
  title: {
    default:
      "VoxaLink Pro | Igniting Blockchain Infused Innovation Through Speech-AI",
    template: "%s",
  },
  description: {
    default:
      "Navigating Real-World Constraints by Interweaving Blockchain Technology With Speech AI",
    template: "%s",
  },
  openGraph: {
    title:
      "VoxaLink Pro | Igniting Blockchain Infused Innovation Through Speech-AI",
    description:
      "Navigating Real-World Constraints by Interweaving Blockchain Technology With Speech AI",
    url: "https://voxalinkpro.io",
    siteName: "VoxaLink Pro",
    images: [
      {
        url: "https://voxa-link-pro.vercel.app/images/VoxaLinkCover.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Layout({ children, title }) {
  return (
    <ServerLayout>
      <ClientLayout>{children}</ClientLayout>
    </ServerLayout>
  );
}
