type ClusterInfo = {
  id: string
  ip: string
  publicPort: number
  p2pPort: number
  session: string
  state: string
}
type ClusterInfoProps = {
  clusterName: string
  apiUrl: string
}

export async function Cluster({ clusterName, apiUrl }: ClusterInfoProps) {
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

  return (
    <section className="mt-10 flex flex-col items-start px-6 justify-center">
      <h2 className="text-2xl font-bold">Cluster Info: {clusterName}</h2>
      <table className="w-full text-sm text-left table-fixed">
        <thead className="text-xs uppercase">
          <tr>
            <th scope="col" className="py-3 w-64">
              Id
            </th>
            <th scope="col">Ip</th>
            <th scope="col">Public port</th>
            <th scope="col">P2P port</th>
            <th scope="col">Session</th>
            <th scope="col">State</th>
          </tr>
        </thead>
        <tbody>
          {clusterInfo.map((infos) => (
            <tr key={infos.id} className="border-b">
              <td scope="row" className="font-medium truncate hover:text-clip">
                {infos.id}
              </td>
              <td scope="row">{infos.ip}</td>
              <td scope="row">{infos.publicPort}</td>
              <td scope="row">{infos.p2pPort}</td>
              <td scope="row">{infos.session}</td>
              <td scope="row">{infos.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
