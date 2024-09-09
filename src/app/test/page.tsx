"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { airdropL0Tokens, generateWallets } from "@/lib/airdropL0Tokens";

const Tokenflow = () => {
  const { theme } = useTheme();
  const [csvUploaded, setCsvUploaded] = useState<boolean>(false);
  const [csvData, setCsvData] = useState<any>(null);

  function handleClick() {
    console.log("clicked");
    // pass transaction to airdropL0Tokens function
    generateWallets();
  }

  return (
    <div className="">
      <p className="flex justify-start font-semibold text-2xl">
        Airdrop L0 Tokens with Tokenflow
      </p>

      <button
        onClick={handleClick}
        className={`${
          theme === "dark" ? "text-black bg-slate-100" : "text-white bg-black"
        } rounded-[10px] py-1 px-2 flex items-center gap-1`}
      >
        Generate Wallet
      </button>
    </div>
  );
};

export default Tokenflow;
