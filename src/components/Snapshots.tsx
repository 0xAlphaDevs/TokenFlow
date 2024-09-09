'use client'

import { SnapshotInfoWithRawJSON } from '@/types'
import { useCallback, useEffect, useState } from 'react'
import { JsonModal } from './JsonModal'
import { Loading } from './Loading'

type SnapshotsProps = {
  clusterName: string
  isGlobalSnapshot?: boolean
}

export function Snapshots({ clusterName, isGlobalSnapshot }: SnapshotsProps) {
  const [snapshots, setSnaphots] = useState([] as SnapshotInfoWithRawJSON[])
  const [modalIsOpened, setModalIsOpened] = useState(false)
  const [jsonModalContent, setJsonModalContent] = useState<string | null>(null)
  const [jsonModalOrdinal, setJsonModalOrdinal] = useState<number>(0)
  const [seconds, setSeconds] = useState(0)
  const textColor = isGlobalSnapshot ? 'text-white' : 'text-black'

  const formatJSONContent = (snapshot: any) => {
    if (!snapshot.value.stateChannelSnapshots) {
      return snapshot
    }

    for (const key of Object.keys(snapshot.value.stateChannelSnapshots)) {
      snapshot.value.stateChannelSnapshots[key] =
        snapshot.value.stateChannelSnapshots[key].map((info: any) => {
          info.value.content = '<Buffer>'
          return info
        })
    }

    return snapshot
  }

  const refreshSnapshotsList = () => {
    if (typeof window === 'undefined') {
      return
    }

    const storedSnapshots = localStorage.getItem(clusterName)
    if (storedSnapshots && storedSnapshots !== '{}') {
      const rawStoredSnapshots = JSON.parse(storedSnapshots)
      const storedSnapshotsParsed = rawStoredSnapshots
        .map((snapshot: any) => {
          const currentSnapshot: SnapshotInfoWithRawJSON = snapshot
          snapshot = formatJSONContent(snapshot)
          currentSnapshot.rawJSON = snapshot
          return currentSnapshot
        })
        .sort((a: SnapshotInfoWithRawJSON, b: SnapshotInfoWithRawJSON) => {
          return b.value.ordinal < a.value.ordinal ? -1 : 1
        })
      setSnaphots(storedSnapshotsParsed)
    }
    setSeconds(seconds > 10 ? 0 : seconds + 1)
  }

  const toogleOpenModal = useCallback(
    (content: string, ordinal: number) => {
      if (!modalIsOpened) {
        setJsonModalContent(content)
        setJsonModalOrdinal(ordinal)
      }

      setModalIsOpened(!modalIsOpened)
    },
    [modalIsOpened],
  )

  const renderModal = () => {
    if (!jsonModalContent) {
      return <></>
    }

    return (
      <JsonModal
        clusterName={clusterName}
        ordinal={jsonModalOrdinal}
        isGlobalSnapshot={isGlobalSnapshot}
        content={jsonModalContent}
        toggleOpenModal={toogleOpenModal}
        isOpened={modalIsOpened}
      />
    )
  }

  useEffect(() => {
    refreshSnapshotsList()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      refreshSnapshotsList()
    }, 1000)
  }, [seconds])

  return (
    <div
      className={`rounded-lg relative ${
        isGlobalSnapshot
          ? 'bg-[#4D515A] dark:bg-[#40454E] text-white'
          : 'bg-[#B9DD6D] text-black'
      }`}
    >
      {jsonModalContent && renderModal()}
      <div className="flex flex-col p-6">
        <div className="flex">
          <div className="inline-block w-full">
            <h3
              className={`text-2xl font-display ${textColor} leading-[1.2rem] mb-[5px]`}
            >
              Snapshots
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
        {snapshots && snapshots.length > 0 ? (
          <table className="mb-6 w-full table-auto text-left border-0">
            <thead
              className={`border-b border-black/30 top-0 z-1 border-separate shadow sticky ${
                isGlobalSnapshot
                  ? 'bg-[#4D515A] dark:bg-[#40454E] text-white'
                  : 'bg-[#B9DD6D]'
              }`}
            >
              <tr>
                <th className={`headerRow ${textColor}`}>Ordinal</th>
                <th className={`headerRow ${textColor}`}>Snapshot Hash</th>
                <th className={`headerRow ${textColor} text-right`}>JSON</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map((snapshot) => (
                <tr key={snapshot.value.ordinal} className="tableRow">
                  <td className={`dataRow ${textColor} font-light`}>
                    <span className="bg-darken px-[10px] py-[5px] rounded-[100px]">
                      {snapshot.value.ordinal}
                    </span>
                  </td>
                  <td className={`dataRow ${textColor} font-light`}>
                    {snapshot.value.lastSnapshotHash.replace(
                      /(.{20}).*?(.{20})$/,
                      '$1•••$2',
                    )}
                  </td>
                  <td className="pr-6 text-right">
                    <div>
                      <button
                        onClick={() =>
                          toogleOpenModal(
                            JSON.stringify(snapshot.rawJSON.value),
                            snapshot.value.ordinal,
                          )
                        }
                      >
                        <svg
                          width="24"
                          height="24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="float-right"
                        >
                          <rect
                            width="24"
                            height="24"
                            rx="12"
                            fill="currentColor"
                            className="fill-black/10"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.397 8.654a.525.525 0 0 1 0 .743L6.793 12l2.604 2.603a.525.525 0 0 1-.743.743L5.68 12.372a.525.525 0 0 1 0-.743l2.975-2.975a.525.525 0 0 1 .743 0Zm5.207 0a.525.525 0 0 1 .743 0l2.975 2.975a.525.525 0 0 1 0 .743l-2.975 2.975a.525.525 0 1 1-.743-.743l2.604-2.603-2.604-2.604a.525.525 0 0 1 0-.743ZM12.965 6.408c.285.05.477.32.428.607l-1.75 10.15a.525.525 0 0 1-1.035-.179l1.75-10.15a.525.525 0 0 1 .607-.428Z"
                            fill="currentColor"
                            className={
                              isGlobalSnapshot
                                ? 'fill-white/70'
                                : 'fill-black/70'
                            }
                          />
                        </svg>
                      </button>
                    </div>
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
