"use client";

import { useEffect, useState } from "react";

interface AirdropTableInfo {
  id: number;
  destination: string;
  amount: number;
  fee: number;
}

export function AirDropTable({ csvData }: { csvData: any }) {
  const [transactions, setTransactions] = useState([] as AirdropTableInfo[]);
  const isGlobalSnapshot = false;
  const textColor = isGlobalSnapshot ? "text-white" : "text-black";

  useEffect(() => {
    if (csvData) {
      const transactions: AirdropTableInfo[] = csvData.map((row, index) => {
        return {
          id: index,
          destination: row[0],
          amount: Number(row[1]),
          fee: 0,
        };
      });
      setTransactions(transactions);
    }
  }, []);

  return (
    <div
      className={`rounded-lg relative ${
        isGlobalSnapshot
          ? "bg-[#4D515A] dark:bg-[#40454E] text-white"
          : "bg-[#B9DD6D] text-black"
      }`}
    >
      <div className="flex flex-col p-6">
        <div className="flex">
          <div className="inline-block w-full">
            <h3
              className={`text-2xl font-display ${textColor} leading-[1.2rem] mb-[5px]`}
            >
              Transactions
            </h3>
            <span
              className={`font-label font-medium uppercase text-xs tracking-tight ${textColor}/50`}
            >
              L0 Token
            </span>
          </div>
          <div>
            <svg
              width="14"
              height="14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="2.667" cy="2.667" r="2.667" fill="#000" />
              <circle cx="11.334" cy="2.667" r="2.667" fill="#000" />
              <circle cx="11.334" cy="11.334" r="2.667" fill="#000" />
            </svg>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[500px]">
        <table className="mb-6 w-full table-auto text-left border-0">
          <thead
            className={`border-b border-black/30 top-0 z-1 border-separate shadow sticky ${
              isGlobalSnapshot
                ? "bg-[#4D515A] dark:bg-[#40454E] text-white"
                : "bg-[#B9DD6D]"
            }`}
          >
            <tr>
              <th className={`headerRow ${textColor}`}></th>
              <th className={`headerRow ${textColor}`}>Destination Address</th>

              <th className={`headerRow ${textColor}`}>Amount</th>
              <th className={`headerRow ${textColor}`}>Fee</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={`${transaction.id}-${transaction.destination}-${transaction.amount}-${transaction.fee}`}
                className="tableRow"
              >
                <td className={`dataRow ${textColor} font-light`}>
                  <span className="bg-darken px-[10px] py-[5px] rounded-[100px]">
                    {transaction.id}
                  </span>
                </td>
                <td className={`dataRow ${textColor} font-light`}>
                  {transaction.destination}
                </td>

                <td className={`dataRow ${textColor} font-light`}>
                  {new Intl.NumberFormat("en-US", {
                    maximumSignificantDigits: 21,
                  }).format(transaction.amount)}
                </td>
                <td className={`dataRow ${textColor} font-light`}>
                  {new Intl.NumberFormat("en-US", {
                    maximumSignificantDigits: 21,
                  }).format(transaction.fee / 1e8)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
