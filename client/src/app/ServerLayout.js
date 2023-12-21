import React from "react";
import { Poppins } from "next/font/google";
import localFont from "@next/font/local";
import Script from "next/script";

// Font configurations at the module scope
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
const monument = localFont({
  src: "../../public/fonts/MonumentExtended-Ultrabold.otf",
  variable: "--font-monument",
});

export default function ServerLayout({ children }) {
  return (
    <>
      <html lang="en" className="light">
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS}`}
        />

        <Script id="google-analytics" strategy="lazyOnload">
          {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
        </Script>
        <body
          className={`${poppins.className} ${monument.variable} scrollbar-thin scrollbar-thumb-[#BC96E6] scrollbar-track-[#242F40] scrollbar-rounded`}
        >
          {children}
        </body>
      </html>
    </>
  );
}
