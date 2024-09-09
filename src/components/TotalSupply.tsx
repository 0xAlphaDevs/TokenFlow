'use client'

import { useEffect, useState } from 'react'
import { Loading } from './Loading'

type TotalSupplyInfo = {
  total: number
  ordinal: number
}

type TotalSupplyProps = {
  clusterName: string
  apiUrl: string
  isGlobalSnapshot?: boolean
}

// We should fetch each 5 seconds for new snapshots
const REFRESH_TIME = 5

export function TotalSupply({
  clusterName,
  apiUrl,
  isGlobalSnapshot,
}: TotalSupplyProps) {
  const [totalSupplyInfo, setTotalSupplyInfo] = useState({} as TotalSupplyInfo)
  const [seconds, setSeconds] = useState(0)

  const numberFormatter = (num: number) => {
    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' },
    ]
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    const item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value
      })
    return item
      ? (num / item.value).toFixed(2).replace(rx, '$1') + item.symbol
      : '0'
  }

  const fetchTotalSupply = async () => {
    const url = isGlobalSnapshot
      ? `${apiUrl}/dag/total-supply`
      : `${apiUrl}/currency/total-supply`

    const totalSupplyInfoResponse = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      next: {
        revalidate: 5,
      },
    })

    setTotalSupplyInfo(await totalSupplyInfoResponse.json())
    setSeconds(seconds > 10 ? 0 : seconds + 1)
  }

  useEffect(() => {
    if (seconds === 0) {
      setSeconds(seconds + 1)
      return
    }

    setTimeout(() => {
      if (seconds === 0 || seconds % REFRESH_TIME !== 0) {
        setSeconds(seconds + 1)
      } else {
        fetchTotalSupply()
      }
    }, 1000)
  }, [seconds])

  const textColor = isGlobalSnapshot ? 'text-white' : 'text-black'

  return (
    <div
      className={`rounded-lg p-6 h-full ${
        isGlobalSnapshot
          ? 'bg-[#4D515A] dark:bg-[#40454E] text-white'
          : 'bg-[#B9DD6D] text-black'
      }}`}
    >
      <div className="flex flex-col">
        <div className="flex">
          <div className="inline-block w-full">
            <h3
              className={`text-lg font-display ${textColor} leading-[1.2rem] mb-[5px]`}
            >
              Total Supply
            </h3>
          </div>
          <div className="flex w-[200px]">
            <span
              className={`ml-1 w-full leading-[.9rem] font-label font-light ${textColor} text-right`}
            >
              {isGlobalSnapshot ? 'DAG' : 'Currency L0'}
            </span>
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 text-center py-7 pb-8">
        {totalSupplyInfo.total ? (
          <>
            <div
              className={`font-display text-[58px] leading-none ${textColor}`}
            >
              {numberFormatter(totalSupplyInfo.total / 1e8)}
            </div>
            <div className={`font-label text-xs ${textColor} pt-3`}>
              {new Intl.NumberFormat('en-US', {
                maximumSignificantDigits: 21,
              }).format(totalSupplyInfo.total / 1e8)}
            </div>
          </>
        ) : (
          <>
            <Loading textColor={textColor} />
          </>
        )}
      </div>
    </div>
  )
}
