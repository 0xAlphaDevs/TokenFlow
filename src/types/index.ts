type WalletBalanceInfo = {
  [address: string]: number
}

export type TransactionsInfo = {
  source: string
  destination: string
  amount: number
  fee: number
  ordinal: number
}

type BlocksInfo = {
  block: {
    value: {
      transactions?: {
        value: TransactionsInfo
      }[]
    }
  }
}

export type SnapshotInfo = {
  value: {
    ordinal: number
    total: number
    lastSnapshotHash: string
    blocks?: BlocksInfo[]
    info: {
      balances: WalletBalanceInfo
    }
  }
}

export type SnapshotInfoWithRawJSON = {
  rawJSON: any
  value: {
    ordinal: number
    total: number
    lastSnapshotHash: string
    info: {
      balances: WalletBalanceInfo
    }
  }
}

export type BalancesInfo = {
  balances: WalletBalanceInfo
}
