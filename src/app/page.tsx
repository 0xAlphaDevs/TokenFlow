import { ClusterMetrics } from '@/components/ClusterMetrics'
import { LatestSnapshot } from '@/components/LatestSnapshot'
import { Snapshots } from '@/components/Snapshots'
import { TotalSupply } from '@/components/TotalSupply'
import { Transactions } from '@/components/Transactions'
import { WalletBalance } from '@/components/WalletBalance'

export const metadata = {
  title: 'Dashboard',
  description: 'Main Dashboard',
}

export default async function Home() {
  if (
    !process.env.L1_CURRENCY_URL ||
    !process.env.L0_CURRENCY_URL ||
    !process.env.L0_GLOBAL_URL
  ) {
    return (
      <h1 className="text-3xl font-bold underline">
        You should provide the: L0_CURRENCY_URL, L1_CURRENCY_URL, and
        L0_GLOBAL_URL as env variables
      </h1>
    )
  }

  const GLOBAL_L0_CLUSTER_NAME = 'Global L0'
  const CURRENCY_L0_CLUSTER_NAME = 'Currency L0'
  const CURRENCY_L1_CLUSTER_NAME = 'Currency L1'

  return (
    <div className="w-full h-full px-6 pb-4 bg-background-light dark:bg-background-dark">
      <section className="mt-6 grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        <ClusterMetrics
          apiUrl={process.env.L0_GLOBAL_URL}
          clusterName={GLOBAL_L0_CLUSTER_NAME}
        />
        <ClusterMetrics
          apiUrl={process.env.L0_CURRENCY_URL}
          clusterName={CURRENCY_L0_CLUSTER_NAME}
        />
        <ClusterMetrics
          apiUrl={process.env.L1_CURRENCY_URL}
          clusterName={CURRENCY_L1_CLUSTER_NAME}
        />
      </section>

      <section className="mt-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
        <LatestSnapshot
          apiUrl={process.env.L0_GLOBAL_URL}
          clusterName={GLOBAL_L0_CLUSTER_NAME}
          isGlobalSnapshot
        />
        <TotalSupply
          apiUrl={process.env.L0_GLOBAL_URL}
          clusterName={GLOBAL_L0_CLUSTER_NAME}
          isGlobalSnapshot
        />

        <LatestSnapshot
          apiUrl={process.env.L0_CURRENCY_URL}
          clusterName={CURRENCY_L0_CLUSTER_NAME}
        />
        <TotalSupply
          apiUrl={process.env.L0_CURRENCY_URL}
          clusterName={CURRENCY_L0_CLUSTER_NAME}
        />
      </section>

      <section className="my-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-2">
        <Snapshots clusterName={GLOBAL_L0_CLUSTER_NAME} isGlobalSnapshot />

        <Snapshots clusterName={CURRENCY_L0_CLUSTER_NAME} />
      </section>

      <section className="my-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-2">
        <WalletBalance
          apiUrl={process.env.L0_GLOBAL_URL}
          clusterName={GLOBAL_L0_CLUSTER_NAME}
          isGlobalSnapshot
        />

        <WalletBalance
          apiUrl={process.env.L0_CURRENCY_URL}
          clusterName={CURRENCY_L0_CLUSTER_NAME}
        />
      </section>

      <section className="my-2 grid w-full grid-cols-1">
        <Transactions clusterName={GLOBAL_L0_CLUSTER_NAME} isGlobalSnapshot />
      </section>
      <section className="my-2 grid w-full grid-cols-1">
        <Transactions clusterName={CURRENCY_L0_CLUSTER_NAME} />
      </section>
    </div>
  )
}
