'use client'
import { BalancesInfo } from '@/types'
import { useEffect, useState } from 'react'
import { Loading } from './Loading'

type WalletBalanceProps = {
  clusterName: string
  apiUrl: string
  isGlobalSnapshot?: boolean
}

export function WalletBalance({
  clusterName,
  apiUrl,
  isGlobalSnapshot,
}: WalletBalanceProps) {
  const [balances, setBalances] = useState({
    balances: {},
  } as BalancesInfo)
  const [seconds, setSeconds] = useState(0)

  const refreshBalances = () => {
    if (typeof window === 'undefined') {
      return
    }
    const latestSnapshotBalanceKey = `${clusterName}_lastest_snapshot_balance`
    const latestSnapshotBalance = localStorage.getItem(latestSnapshotBalanceKey)

    if (latestSnapshotBalance && latestSnapshotBalance !== '{}') {
      const currentBalances: BalancesInfo = JSON.parse(latestSnapshotBalance)
      setBalances(currentBalances)
    }

    setSeconds(seconds > 10 ? 0 : seconds + 1)
  }

  useEffect(() => {
    refreshBalances()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      refreshBalances()
    }, 1000)
  }, [seconds])

  const copyToClipboard = (content: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(content)
    }
  }

  const textColor = isGlobalSnapshot ? 'text-white' : 'text-black'

  return (
    <div
      className={`rounded-lg ${
        isGlobalSnapshot
          ? 'bg-[#4D515A] dark:bg-[#40454E] text-white'
          : 'bg-[#B9DD6D] text-black'
      }`}
    >
      <div className="flex flex-col p-6">
        <div className="flex">
          <div className="inline-block w-full">
            <h3
              className={`text-2xl font-display ${textColor} leading-[1.2rem] mb-[5px]`}
            >
              Balances
            </h3>
            <span
              className={`font-label font-medium uppercase text-xs tracking-tight ${textColor}/50`}
            >
              {clusterName}
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
        {balances && Object.keys(balances.balances).length > 0 ? (
          <table className="mb-6 w-full table-auto text-left border-0">
            <thead className="border-b border-black/30">
              <tr>
                <th className={`headerRow  ${textColor}`}>Address</th>
                <th className={`headerRow  ${textColor} text-right`}>
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {balances &&
                Object.keys(balances.balances).map((key) => (
                  <tr key={key} className="tableRow">
                    <td
                      className={`dataRow flex align-center ${textColor} font-light`}
                    >
                      {key}
                      <button onClick={() => copyToClipboard(key)}>
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mt-[-1px] ml-[10px]"
                        >
                          <rect
                            width="26"
                            height="26"
                            rx="13"
                            fill="black"
                            fillOpacity="0.08"
                          />
                          <path
                            d="M16 10.5V9C16 8.17157 15.3284 7.5 14.5 7.5H9C8.17157 7.5 7.5 8.17157 7.5 9V14.5C7.5 15.3284 8.17157 16 9 16H10.5M16 10.5H17C17.8284 10.5 18.5 11.1716 18.5 12V17C18.5 17.8284 17.8284 18.5 17 18.5H12C11.1716 18.5 10.5 17.8284 10.5 17V16M16 10.5H12C11.1716 10.5 10.5 11.1716 10.5 12V16"
                            stroke="black"
                            strokeOpacity="0.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={
                              isGlobalSnapshot
                                ? 'stroke-white/70'
                                : 'stroke-black/70'
                            }
                          />
                        </svg>
                      </button>
                    </td>
                    <td
                      className={`dataRow  ${textColor} font-light text-right`}
                    >
                      {new Intl.NumberFormat('en-US', {
                        maximumSignificantDigits: 10,
                      }).format((balances.balances[key] as number) / 1e8)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="my-[20px] ml-[20px]">
            <Loading textColor={textColor} />
          </div>
        )}
      </div>
    </div>
  )
}
