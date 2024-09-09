'use client'

import { useEffect, useRef } from 'react'

type JsonModalProps = {
  clusterName: string
  ordinal: number
  content: string
  toggleOpenModal: (content: string, ordinal: number) => void
  isOpened: boolean
  isGlobalSnapshot?: boolean
}

export function JsonModal({
  clusterName,
  ordinal,
  content,
  toggleOpenModal,
  isOpened,
  isGlobalSnapshot,
}: JsonModalProps) {
  const jsonFormatted = JSON.stringify(JSON.parse(content), null, 4)
  const wrapperRef = useRef<any | null>(null)

  const copyToClipboard = (content: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(content)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        toggleOpenModal('', 0)
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <>
      {isOpened && (
        <div
          ref={wrapperRef}
          className={`absolute bg-json-modal-bg w-[100%] xl:w-[650px] h-[580px] rounded-[12px] text-white ${
            isGlobalSnapshot ? 'xl:left-2/4' : 'xl:right-2/4'
          } z-10`}
        >
          <div className="flex justify-between align-center bg-[#1F1F21] border-b border-[#1F1F21] rounded-[12px]">
            <span className="font-label font-normal pl-[30px] pt-[24px] pb-[23px]">
              {clusterName} <span className="text-json-modal-slash">/</span>{' '}
              Snapshots <span className="text-json-modal-slash">/</span> Ordinal{' '}
              {ordinal}
            </span>
            <div className="flex justify-between pr-[20px] pt-[20px] pb-[23px] w-[150px]">
              <button
                onClick={() => {
                  copyToClipboard(jsonFormatted)
                }}
                className="bg-json-modal-buttons-bg rounded-[100px] px-[20px] py-[5px]"
              >
                COPY
              </button>
              <button
                onClick={() => toggleOpenModal('', 0)}
                className="bg-json-modal-buttons-bg rounded-[100px] px-[15px] py-[5px]"
              >
                X
              </button>
            </div>
          </div>
          <div className="font-mono pt-[28px] pl-[30px] pr-[19px]">
            <pre className="max-h-[450px] overflow-y-auto">{jsonFormatted}</pre>
          </div>
        </div>
      )}
    </>
  )
}
