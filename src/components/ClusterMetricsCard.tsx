import { Loading } from './Loading'

type NodeContentProps = {
  nodeId: string
  ipAddress: string
  state: string
}

type ClusterMetricsCardProps = {
  clusterName: string
  nodesContent: NodeContentProps[]
}

const nodeStates = {
  READY: 'READY',
  INITIAL: 'INITIAL',
  READY_TO_JOIN: 'READY TO JOIN',
  LOADING_GENESIS: 'LOADING GENESIS',
  GENESIS_READY: 'GENESIS READY',
  STARTING_SESSION: 'STARTING_SESSION',
  SESSION_STARTED: 'SESSION STARTED',
  WAITING_FOR_DOWNLOAD: 'WAITING FOR DOWNLOAD',
  DOWNLOAD_IN_PROGRESS: 'DOWNLOAD IN PROGRESS',
  LEAVING: 'LEAVING',
  OFFLINE: 'OFFLINE',
}

export function ClusterMetricsCard({
  clusterName,
  nodesContent,
}: ClusterMetricsCardProps) {
  return (
    <div className="rounded-lg bg-[#E0E0E4] shadow dark:bg-[#D2D2D6]">
      <div className="flex flex-col p-6">
        <div className="flex">
          <div className="inline-block w-full">
            <h3 className="text-2xl font-display dark:text-black text-black leading-[1.2rem] mb-[5px]">
              Cluster Metrics
            </h3>
            <span className="font-label font-medium uppercase text-xs tracking-tight text-black/50">
              {clusterName} / {nodesContent.length}
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
        {nodesContent && nodesContent.length > 0 ? (
          <table className="mb-6 w-full table-auto text-left border-0">
            <thead className="border-b border-black/30 sticky top-0 z-10 border-separate bg-[#E0E0E4] shadow dark:bg-[#D2D2D6]">
              <tr>
                <th className="headerRow">Node ID</th>
                <th className="headerRow">IP Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              {nodesContent.map((content) => (
                <tr key={content.ipAddress} className="tableRow">
                  <td className="dataRow">{content.nodeId}</td>
                  <td className="dataRow">{content.ipAddress}</td>
                  <td className="pb-2">
                    {[
                      nodeStates.READY,
                      nodeStates.INITIAL,
                      nodeStates.READY_TO_JOIN,
                    ].includes(content.state.toUpperCase()) ? (
                      <span className="label badgeReady">{content.state}</span>
                    ) : [
                        nodeStates.LOADING_GENESIS,
                        nodeStates.GENESIS_READY,
                      ].includes(content.state.toUpperCase()) ? (
                      <span className="label badgeLoadingGenesis">
                        {content.state}
                      </span>
                    ) : [
                        nodeStates.STARTING_SESSION,
                        nodeStates.SESSION_STARTED,
                      ].includes(content.state.toUpperCase()) ? (
                      <span className="label badgeStartingSession">
                        {content.state}
                      </span>
                    ) : [
                        nodeStates.WAITING_FOR_DOWNLOAD,
                        nodeStates.DOWNLOAD_IN_PROGRESS,
                      ].includes(content.state.toUpperCase()) ? (
                      <span className="label badgeWaitingForDownload">
                        {content.state}
                      </span>
                    ) : (
                      <span className="label badgeLeaving">
                        {content.state}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="my-[20px] ml-[20px]">
            <Loading textColor="" />
          </div>
        )}
      </div>
    </div>
  )
}
