"use client";
import { React, useState, useEffect, useContext } from "react";
import Image from "next/image";
import PreSaleCard from "../components/PreSaleCard";
import LogoSlider from "@/components/Slider";
import Cards from "@/components/Cards";
import Typewriter from "typewriter-effect";
import SalesTable from "@/components/SalesTable";
import AllocationTable from "@/components/AllocationTable";
import RoadmapTable from "@/components/RoadmapTable";
import PressReleaseCard from "@/components/PressReleaseCard";
import PressData from "../PressReleaseData.json";
import VideoPlayer from "@/components/VideoPlayer";
import dynamic from "next/dynamic";
import ExampleChart from "@/components/Chart";
import styles from "../styles/Polkadot.module.css";
import Faq from "@/components/Faq";
import TokenContract from "@/components/TokenContract";
import { ScrollContext } from "@/context/ScrollContext";

const DynamicGlobe = dynamic(() => import("@/components/Globe"), {
  ssr: false, // Disable server-side rendering for this component
});

const logos = [
  "/logos/bloomberg.svg",
  "/logos/bitcoin_insider.svg",
  "/logos/buisness_news.svg",
  "/logos/binance.svg",
  "/logos/crypto_daily.svg",
  "/logos/crypto_news.svg",
  "/logos/investing.svg",
  "/logos/marketwatch.svg",
  "/logos/DigitalJournal.svg",
  "/logos/cointelegraph.svg",
  "/logos/techbullion.svg",
  // ... add more logos
];

const chartData = {
  chart: {
    type: "pie", // Use "pie" for Pie or Doughnut chart
    backgroundColor: null, // Set the background to transparent
    plotBackgroundColor: null, // Also set the plot background to transparent if necessary
    plotBorderWidth: null,
    plotShadow: false,
  },
  credits: {
    enabled: false, // This will remove the highcharts.com watermark
  },
  title: {
    text: null, // Set the title of the chart
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
  },
  accessibility: {
    point: {
      valueSuffix: "%",
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.percentage:.1f} %",
      },
      showInLegend: true,
    },
  },
  series: [
    {
      name: "Tokens",
      colorByPoint: true, // This allows individual colors for each slice
      innerSize: "61%", // Set to 0% for a Pie chart, or any percentage for a Doughnut chart
      data: [
        { name: "Treasury", y: 25 },
        { name: "ICO", y: 40 },
        { name: "Liquidity Pool", y: 7 },
        { name: "ICO Bonus", y: 2 },
        { name: "Rewards", y: 5 },
        { name: "Reserve", y: 5 },
        { name: "Staking", y: 2 },
        { name: "Partners/CEX Partners", y: 6 },
        { name: "Marketing", y: 8 },
        // ...add more data points if necessary
      ],
    },
  ],
  colors: [
    "rgba(54, 162, 235, 0.7)", // Treasury
    "rgba(255, 0, 151, 0.7)", // ICO
    "rgba(255, 206, 86, 0.7)", // Liquidity Pool
    "rgba(14, 190, 37, 0.7)", // ICO Bonus
    "rgba(255, 99, 132, 0.7)", // Rewards
    // ...add more colors for each slice if necessary
  ],
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [selectedTable, setSelectedTable] = useState("sales");
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const { preSaleCardRef, giftCardRef } = useContext(ScrollContext);

  // Function to render the selected table component
  const renderTable = () => {
    switch (selectedTable) {
      case "sales":
        return <SalesTable />;
      case "allocation":
        return <AllocationTable />;
      case "roadmap":
        return <RoadmapTable />;
      default:
        return null;
    }
  };

  const scrollToPreSaleCard = () => {
    if (preSaleCardRef && preSaleCardRef.current) {
      preSaleCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    setIsClient(true); // Now we know it's client-side

    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to determine if the globe section should be rendered
  const shouldRenderGlobeSection = () => {
    // You can define your own logic for when to show the globe section
    return isClient && windowSize.width > 1024; // For example, only show on larger screens
  };

  return (
    <main className="pt-[8rem] bg-[#17181d] z-0 relative overflow-hidden">
      <div className="relative">
        {/* Purple Circle - hidden on screens smaller than md */}
        <div className="hidden md:block absolute w-[50rem] h-[50rem] opacity-70 bg-[#b63fc9] rounded-full blur-[20rem] top-[-18rem] left-[-30rem]"></div>
        <div className="absolute top-[-20rem] right-0 -rotate-45">
          <Image src="/images/temporary.png" width={600} height={600} />
        </div>
      </div>
      {/* Content */}
      <div className="flex lg:flex-row flex-col gap-6 justify-between items-center z-10 relative mt-10 mx-5 lg:mr-[12rem] lg:ml-[8rem]">
        <div className="md:w-[40%] w-full">
          <h1 className="text-white text-[2rem] lg:text-[3rem] font-bold font-monument lg:text-left text-center">
            The Ultimate Web3 Speech Recognition Tech Hub
          </h1>
        </div>
        <div ref={preSaleCardRef}>
          <PreSaleCard />
        </div>
      </div>
      <div className="relative">
        {/* Red Circle - hidden on screens smaller than md */}
        <div className="hidden md:block absolute w-[25rem] h-[25rem] opacity-50 bg-[#068bf8] rounded-full blur-[20rem] top-[50rem] right-0"></div>
      </div>
      <div className="mt-[7rem]">
        <LogoSlider />
      </div>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-white text-3xl font-semibold mt-[10rem] mb-10">
          Our AI services
        </h1>
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-[2px] rounded-3xl">
          <div className="bg-[#17181d] p-10 rounded-3xl text-left">
            <Cards />
          </div>
        </div>
      </div>
      <div class="flex flex-col md:flex-row flex-wrap justify-center items-center my-[5rem]">
        <div class="md:w-1/2 flex justify-center">
          <div class="md:scale-60 scale-75">
            <VideoPlayer />
          </div>
        </div>
        <div class="md:w-1/2 flex flex-col">
          <h1 class="text-white text-[30px] lg:text-[40px] text-center md:text-left">
            Here at <b>VoxaLink</b> we thrive for your
          </h1>
          <div class="text-center md:text-left">
            <h1 class="font-bold py-5 text-[30px] md:text-[40px] lg:text-[50px] text-transparent bg-clip-text bg-gradient-to-r from-[#E23E57] to-[#A91079]">
              <Typewriter
                options={{
                  strings: ["Satisfaction", "Security", "Ease"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </h1>
          </div>
        </div>
      </div>
      <div className="relative">
        {/* Sea Green Circle - hidden on screens smaller than md */}
        <div className="hidden md:block absolute w-[25rem] h-[25rem] opacity-50 bg-[#51e1ee] rounded-full blur-[20rem] top-[10rem] right-0"></div>
        {/* Blue Circle - hidden on screens smaller than md */}
        <div className="hidden md:block absolute w-[25rem] h-[25rem] opacity-60 bg-[#4752b6] rounded-full blur-[20rem] top-[50rem] leftt-0"></div>
      </div>
      <div className="flex flex-col justify-center items-center text-center my-[5rem]">
        <div className="p-[2rem] md:p-[5rem] rounded-2xl bg-[#3333] flex flex-col justify-center items-center z-10 shadow-lg lg:w-[60%] md:w-[65%] w-[90%] relative">
          <div class={`${styles.polkaDots} blur-md`}>
            <div class={styles.dot}></div>
            <div class={styles.dot}></div>
            <div class={styles.dot}></div>
            <div class={styles.dot}></div>
            <div class={styles.dot}></div>
            <div class={styles.dot}></div>
          </div>
          <Image
            src="/images/logo.png"
            width={130}
            height={130}
            className="absolute top-1/2 left-1/2 transform md:-translate-x-[49%] md:scale-100 scale-75 md:-translate-y-[27%] -translate-x-[45%] -translate-y-[10%]"
          />
          <h1 className="text-white text-2xl md:text-3xl font-bold">
            Tokenomics
          </h1>
          <p className="text-[#d1d1d3]">
            VoxaLink Pro is a ERC-20 token deployed on Ethereum mainnet. The
            total supply of $VXLP tokens is 1 billion (1,000,000,000).
          </p>
          <div className="mt-10">
            <ExampleChart />
          </div>
        </div>
      </div>
      <div className="mt-[13rem] mb-[10rem] mx-4">
        {/* Buttons and Table */}
        <div className="flex flex-col items-center justify-center">
          {/* Add padding inside the scrollable container */}
          <div className="flex flex-wrap justify-start gap-4">
            <button
              className={`flex-shrink-0 px-6 py-2 text-white ${
                selectedTable === "sales" ? "bg-purple-600" : "bg-[#191F34]"
              } rounded-md mx-2`}
              onClick={() => setSelectedTable("sales")}
              style={{ minWidth: "140px" }}
            >
              Sales Details
            </button>
            <button
              className={`flex-shrink-0 px-6 py-2 text-white ${
                selectedTable === "allocation"
                  ? "bg-purple-600"
                  : "bg-[#191F34]"
              } rounded-md mx-2`}
              onClick={() => setSelectedTable("allocation")}
              style={{ minWidth: "140px" }}
            >
              Allocation and Vesting
            </button>
            <button
              className={`flex-shrink-0 px-6 py-2 text-white ${
                selectedTable === "roadmap" ? "bg-purple-600" : "bg-[#191F34]"
              } rounded-md mx-2`}
              onClick={() => setSelectedTable("roadmap")}
              style={{ minWidth: "140px" }}
            >
              Road Map
            </button>
          </div>
          <div className="w-full lg:w-[70%] mt-10">{renderTable()}</div>
        </div>
      </div>
      <div className="md:mt-[10rem] mt-[5-rem]">
        <PressReleaseCard data={PressData} />
      </div>
      {shouldRenderGlobeSection() && (
        <div className="mt-[10rem] p-2 flex-col items-center flex">
          <h1 className="text-2xl lg:text-[50px] p-5 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-center text-wrap mx-20 md:mx-0">
            Bringing The World Together
          </h1>
          <DynamicGlobe />
        </div>
      )}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 mt-[10rem] pb-[15rem] pt-[5rem] md:py-[15rem] px-3 flex justify-center">
        <div className="md:w-[70%] w-full">
          <TokenContract />
        </div>
      </div>
      <div className="bg-[#17181D] flex flex-col justify-center items-center text-left px-10 pb-[10rem]">
        <div
          className="w-full lg:w-[90%] xl:w-[60%] rounded-xl bg-[#FEC5A3] h-[40rem] lg:h-[25rem] transform translate-y-[-172px] justify-between md:py-[4rem] py-[2rem] md:px-10 px-6 relative overflow-hidden"
          ref={giftCardRef}
        >
          {/* text */}
          <div className="flex flex-col gap-9 md:w-2/3">
            <h1 className="text-4xl font-bold">$100k and Corvette Giveaway!</h1>
            <p>
              The more $VXLP you purchase and the more you participate in Gleam,
              the more tickets you earn, and the higher your chances of walking
              away with these extraordinary prizes!
            </p>
            <button
              className="p-4 text-white bg-black w-[200px] rounded-lg"
              onClick={scrollToPreSaleCard}
            >
              Join the Giveaway
            </button>
          </div>
          {/* image */}
          <div className="w-1/2 md:w-1/3">
            <Image
              src="/images/corvette.png"
              width={600}
              height={600}
              className="pointer-events-none absolute 2xl:-right-[150px] 2xl:-top-[100px] xl:-top-[100px] xl:-right-[230px] xl:scale-90 lg:-top-[100px] lg:-right-[200px] scale-125 bottom-[-40px] right-[-60px]"
            />
          </div>
        </div>
        <div className="w-full md:w-[60%] transform -translate-y-20">
          <Faq />
        </div>
      </div>
    </main>
  );
}
