"use client";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import React, { useState, useEffect } from "react";

export default function ExampleChart() {
  const [chartSize, setChartSize] = useState({ width: 400, height: 400 });

  useEffect(() => {
    function handleResize() {
      // Set chart size based on window width
      if (window.innerWidth < 768) {
        // 768px is a common breakpoint for 'md' size
        setChartSize({ width: 360, height: 360 });
      } else {
        setChartSize({ width: 400, height: 400 });
      }
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call the function to set the initial size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures effect is only run on mount and unmount

  const options = {
    chart: {
      type: "donut",
    },
    colors: [
      "#b57ff3",
      "#ae62e5",
      "#c172dd",
      "#c86cd3",
      "#ce66c8",
      "#d45fbd",
      "#db59b3",
      "#e153a8",
      "#e84d9e",
    ],

    stroke: {
      show: false, // Set show to false to remove the white border
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        shadeIntensity: 0.6,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [10, 50, 53, 91],
      },
    },
    series: [25, 40, 7, 2, 5, 5, 2, 6, 8],
    labels: [
      "Treasury",
      "ICO",
      "Liquidity Pool",
      "ICO Bonus",
      "Rewards",
      "Reserve",
      "Staking",
      "Partners/CEX Partners",
      "Marketing",
    ],
    legend: {
      position: "bottom",
      labels: {
        colors: [
          "#fff",
          "#fff",
          "#fff",
          "#fff",
          "#fff",
          "#fff",
          "#fff",
          "#fff",
          "#fff",
        ], // This will set the legend text color to white
      },
    },
  };

  return (
    <Chart
      type="donut"
      options={options}
      series={options.series}
      width={chartSize.width}
      height={chartSize.height}
    />
  );
}
