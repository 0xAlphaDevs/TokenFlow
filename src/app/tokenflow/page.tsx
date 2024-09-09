"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { airdropL0Tokens } from "@/lib/airdropL0Tokens";
import { AirDropTable } from "@/components/AirdropTable";

type TransactionInfoProps = {
  destination: string;
  amount: number;
  fee: number;
};

const Tokenflow = () => {
  const { theme } = useTheme();
  const [csvUploaded, setCsvUploaded] = useState<boolean>(false);
  const [csvData, setCsvData] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);
  const [buttonText, setButtonText] = useState<string>("Airdrop Tokens");
  const [airdropAmount, setAirdropAmount] = useState<number>(0);

  function handleClick() {
    console.log("clicked");
    // pass transaction to airdropL0Tokens function
    const transactions: TransactionInfoProps[] = csvData.map((row, index) => {
      return {
        destination: row[0],
        amount: Number(row[1]),
        fee: 0,
      };
    });
    console.log(transactions);
    // call every 1 seconds with 5 transactions
    setButtonText("Airdropping...");

    const interval = setInterval(() => {
      const transactionsToAirdrop = transactions.splice(0, 5);
      if (transactionsToAirdrop.length > 0) {
        console.log("Airdropping 5 transactions", transactionsToAirdrop);
        airdropL0Tokens(transactionsToAirdrop);
        setProgress((progress) => progress + 5);
      }

      if (transactions.length === 0) {
        clearInterval(interval);
        setButtonText("Airdrop Successful");
      }

      console.log("Airdropped 5 transactions");
    }, 500);
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const text = e.target.result;

        // Parse CSV
        const data = parseCSV(text); // Call the CSV parsing function
        // calculte airdrop amount

        const totalAirdropAmount = data.reduce((acc, row) => {
          return acc + Number(row[1]);
        }, 0);

        setAirdropAmount(totalAirdropAmount);
        console.log("Total Airdrop Amount", totalAirdropAmount);
        setCsvData(data);
        setCsvUploaded(true);
      };

      reader.readAsText(file);
    }
  }

  // Function to manually parse CSV
  const parseCSV = (text) => {
    const lines = text.split("\n");
    const result = lines.map((line) => line.split(",")); // Split each line by commas

    return result;
  };

  return (
    <div className="">
      <p className="font-semibold text-2xl">Airdrop L0 Tokens with Tokenflow</p>
      {!csvUploaded ? (
        <div className="border-4 border-dotted h-48 rounded-lg p-4 mt-16">
          <label htmlFor="csvUpload" className="cursor-pointer">
            <div className="text-center mt-16">
              <p className="font-semibold text-gray-600">
                Click to upload CSV file
              </p>
            </div>
            <input
              id="csvUpload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      ) : (
        <div className="py-4 mt-10">
          <AirDropTable csvData={csvData} />
          <div className="flex flex-col gap-4 font-semibold text-gray-500 py-8">
            <p>
              {" "}
              Airdrop Amount : {airdropAmount} ({airdropAmount / 1000000000} %
              of the total supply)
            </p>
            <p>
              {" "}
              Total L0 Token Supply :{" "}
              <span className="bg-green-400 text-white px-2 py-1 rounded-lg">
                1,000,020,000
              </span>
            </p>
          </div>
          <div className="flex justify-center py-4">
            <progress
              className={`w-full h-2 bg-${
                theme === "dark" ? "white" : "black"
              } rounded-lg overflow-hidden`}
              value={progress}
              max={csvData.length}
            >
              {progress}%
            </progress>
          </div>
          <div className="flex justify-center py-4">
            <button
              onClick={handleClick}
              className={
                `${
                  theme === "dark"
                    ? "text-black bg-slate-100"
                    : "text-white bg-black"
                } rounded-[10px] py-1 px-2 flex items-center gap-1 font-semibold` +
                (progress > 0 && progress < 100
                  ? " cursor-not-allowed bg-gray-500"
                  : "") +
                (progress === csvData.length ? " bg-green-700" : "")
              }
              disabled={progress > 0}
            >
              {buttonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tokenflow;
