import React from "react";
import Head from "next/head";
import { Poppins } from "next/font/google";
import localFont from "@next/font/local";
import { ScrollProvider } from "@/context/ScrollContext";

// Font configurations at the module scope
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
const monument = localFont({
  src: "../../public/fonts/MonumentExtended-Ultrabold.otf",
  variable: "--font-monument",
});

export default function ServerLayout({ children, title = "VoxaLink Pro" }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        {/* Other metadata */}
      </Head>
      <html lang="en" className="light">
        <body
          className={`${poppins.className} ${monument.variable} scrollbar-thin scrollbar-thumb-[#BC96E6] scrollbar-track-[#242F40] scrollbar-rounded`}
        >
          {children}
        </body>
      </html>
    </>
  );
}
