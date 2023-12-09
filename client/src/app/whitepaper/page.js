import React from "react";
import { useAccount } from "wagmi";

// const { address, isConnecting, isDisconnected } = useAccount(); do it useEffect to make it work in vercel

const page = () => {
  return (
    <div className="py-[10rem]">
      {/* <div className="absolute w-[50rem] h-[50rem] opacity-80 bg-[#A91079] rounded-full sm:blur-[10rem] transform -translate-x-1/2 -translate-y-3/4 z-2"></div> */}
      {/* {address} */}
      <div className="mx-2"></div>
    </div>
  );
};

export default page;
