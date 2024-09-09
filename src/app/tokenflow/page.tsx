"use client"

import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import { airdropL0Tokens } from '@/lib/airdropL0Tokens'

const Tokenflow = () => {
  const { theme } = useTheme();
  const [csvUploaded, setCsvUploaded] = useState<boolean>(true);
  const [csvData, setCsvData] = useState<any>(null);

  function handleClick() {
    console.log('clicked')
    // pass transaction to airdropL0Tokens function
    airdropL0Tokens()
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically parse the CSV file and extract data
      // For simplicity, let's assume we just set a placeholder
      setCsvData(`File name: ${file.name}`);
      setCsvUploaded(true);
    }
  }

  return (
    <div className=''>
      <p className='font-semibold text-2xl'>Airdrop L0 Tokens with Tokenflow</p>
      {!csvUploaded ? (
        <div className="border-4 border-dotted h-48 rounded-lg p-4 mt-16">
          <label htmlFor="csvUpload" className="cursor-pointer">
            <div className="text-center mt-16">
              <p className='font-semibold text-gray-600'>Click to upload CSV file</p>
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
        <div className="mt-10 ">
          <p>
            Table of content for csv Data
          </p>
          <div className='flex flex-col gap-4'>
            <p> Address: </p>
            <p> Total amount of tokens to be airdropped: 10 % of the total supply</p>
            <p> Total Supply: </p>
          </div>
          <div className='flex justify-center'>
            <button onClick={handleClick} className={`${theme === 'dark' ? 'text-black bg-slate-100' : 'text-white bg-black'} rounded-[10px] py-1 px-2 flex items-center gap-1`}>AirDrop Tokens</button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Tokenflow