'use client'
import { useEffect, useState } from 'react'
import { ClusterMetricsCard } from './ClusterMetricsCard'

type ClusterInfo = {
  id: string
  ip: string
  publicPort: number
  p2pPort: number
  session: string
  state: string
}

type NodeContentProps = {
  nodeId: string
  ipAddress: string
  state: string
}

type ClusterInfoProps = {
  clusterName: string
  apiUrl: string
}

// We should fetch each 10 seconds for updates
const REFRESH_TIME = 10

export function ClusterMetrics({ clusterName, apiUrl }: ClusterInfoProps) {
  const [clusterInfoCards, setClusterInfoCards] = useState<NodeContentProps[]>(
    [],
  )
  const [seconds, setSeconds] = useState(0)

  const fetchClusterInfo = async () => {
    const clusterInfoResponse = await fetch(`${apiUrl}/cluster/info`, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      next: {
        revalidate: 5,
      },
    })

    const clusterInfo: ClusterInfo[] = await clusterInfoResponse.json()
    const clusterInfoCards = clusterInfo.map((info) => {
      return {
        nodeId: info.id.replace(/(.{5}).*?(.{5})$/, '$1•••$2'),
        ipAddress: info.ip,
        state: info.state,
      }
    })
    setClusterInfoCards(clusterInfoCards)
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
        fetchClusterInfo()
      }
    }, 1000)
  }, [seconds])

  return (
    <ClusterMetricsCard
      clusterName={clusterName}
      nodesContent={clusterInfoCards}
    />
  )
}
