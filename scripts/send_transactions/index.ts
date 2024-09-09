import { dag4 } from '@stardust-collective/dag4'
import {
  DagAccount,
  MetagraphTokenClient,
} from '@stardust-collective/dag4-wallet'
import fs from 'fs'

import dotenv from 'dotenv'
dotenv.config()

type TransactionInfoProps = {
  destination: string
  amount: number
  fee: number
}

type NetworkOptions = {
  metagraphId: string
  l0GlobalUrl: string
  l0CurrencyUrl: string
  l1CurrencyUrl: string
  l1DagUrl?: string
}

const logMessage = (message: string) => {
  const formattedMessage = {
    message,
  }
  console.log(formattedMessage)
}

const singleMetagraphTransaction = async (
  metagraphTokenClient: MetagraphTokenClient,
  account: DagAccount,
  transactionInfo: TransactionInfoProps,
) => {
  const { destination, amount, fee } = transactionInfo

  try {
    logMessage(
      `Transaction from: ${account.address} to ${destination} - single`,
    )

    const signedTransaction = await metagraphTokenClient.transfer(
      destination,
      amount,
      fee,
    )

    logMessage(
      `Transaction from: ${
        account.address
      } to ${transactionInfo} sent - single. Generated transaction response body: ${JSON.stringify(
        signedTransaction,
      )}`,
    )
  } catch (e) {
    throw Error(`Error when sending single transaction: ${e}`)
  }
}

const singleDagTransaction = async (
  account: DagAccount,
  transactionInfo: TransactionInfoProps,
) => {
  const { destination, amount, fee } = transactionInfo

  try {
    logMessage(
      `Transaction from: ${account.address} to ${destination} - single`,
    )

    const signedTransaction = await account.generateSignedTransaction(
      destination,
      amount,
      fee,
    )

    await dag4.network.postTransaction(signedTransaction)

    logMessage(
      `Transaction from: ${
        account.address
      } to ${transactionInfo} sent - single. Generated transaction response body: ${JSON.stringify(
        signedTransaction,
      )}`,
    )
  } catch (e) {
    throw Error(`Error when sending single transaction: ${e}`)
  }
}

const batchMetagraphTransaction = async (
  metagraphTokenClient: MetagraphTokenClient,
  account: DagAccount,
  transactionsInfo: TransactionInfoProps[],
) => {
  try {
    const txnsData = []
    for (const transaction of transactionsInfo) {
      const txnBody = {
        address: transaction.destination,
        amount: transaction.amount,
        fee: transaction.fee,
      }

      logMessage(
        `Transaction from: ${account.address} to ${transaction.destination}} - batch.`,
      )

      txnsData.push(txnBody)
    }

    const generatedTransactions =
      await metagraphTokenClient.generateBatchTransactions(txnsData)

    const hashes = await metagraphTokenClient.sendBatchTransactions(
      generatedTransactions,
    )

    logMessage(
      `Transaction from: ${
        account.address
      } sent - batch. Generated transaction response body: ${JSON.stringify(
        generatedTransactions,
      )}. Post hashes: ${hashes}`,
    )

    return hashes
  } catch (e) {
    throw Error(`Error when sending batch transaction: ${e}`)
  }
}

const batchDagTransaction = async (
  account: DagAccount,
  transactionsInfo: TransactionInfoProps[],
) => {
  try {
    const txnsData = []
    for (const transaction of transactionsInfo) {
      const txnBody = {
        address: transaction.destination,
        amount: transaction.amount,
        fee: transaction.fee,
      }

      logMessage(
        `Transaction from: ${account.address} to ${transaction.destination}} - batch.`,
      )

      txnsData.push(txnBody)
    }

    const generatedTransactions = await account.generateBatchTransactions(
      txnsData,
    )
    const hashes = await account.sendBatchTransactions(generatedTransactions)

    logMessage(
      `Transaction from: ${
        account.address
      } sent - batch. Generated transaction response body: ${JSON.stringify(
        generatedTransactions,
      )}. Post hashes: ${hashes}`,
    )

    return hashes
  } catch (e) {
    throw Error(`Error when sending batch transaction: ${e}`)
  }
}

const handleSingleTransaction = async (
  seedWords: string,
  transaction: string,
  networkOptions: NetworkOptions,
  sendDagTransaction: boolean,
) => {
  try {
    const account = dag4.createAccount()
    await account.loginSeedPhrase(seedWords)

    account.connect(
      {
        networkVersion: '2.0',
        l0Url: networkOptions.l0GlobalUrl,
        l1Url: networkOptions.l1DagUrl,
      },
      true,
    )

    try {
      if (!sendDagTransaction) {
        const metagraphTokenClient = account.createMetagraphTokenClient({
          id: networkOptions.metagraphId,
          l0Url: networkOptions.l0CurrencyUrl,
          l1Url: networkOptions.l1CurrencyUrl,
          beUrl: '',
          metagraphId: ''
        })

        await singleMetagraphTransaction(
          metagraphTokenClient,
          account,
          JSON.parse(transaction),
        )
        return
      }

      await singleDagTransaction(account, JSON.parse(transaction))
    } catch (error) {
      const errorMessage = `Error when sending transactions between wallets, message: ${error}`
      logMessage(errorMessage)
    }
  } catch (error) {
    logMessage(`Error when loging in: ${error}`)
  }
}

const handleBatchTransactions = async (
  seedWords: string,
  transactions: TransactionInfoProps[],
  networkOptions: NetworkOptions,
  sendDagTransaction: boolean,
) => {
  try {
    const account = dag4.createAccount()
    await account.loginSeedPhrase(seedWords)

    account.connect(
      {
        networkVersion: '2.0',
        l0Url: networkOptions.l0GlobalUrl,
        l1Url: networkOptions.l1DagUrl,
      },
      true,
    )
    try {
      if (!sendDagTransaction) {
        const metagraphTokenClient = account.createMetagraphTokenClient({
          id: networkOptions.metagraphId,
          l0Url: networkOptions.l0CurrencyUrl,
          l1Url: networkOptions.l1CurrencyUrl,
          beUrl: '',
          metagraphId: ''
        })

        await batchMetagraphTransaction(
          metagraphTokenClient,
          account,
          transactions,
        )
        return
      }

      await batchDagTransaction(account, transactions)
    } catch (error) {
      const errorMessage = `Error when sending transactions between wallets, message: ${error}`
      logMessage(errorMessage)
    }
  } catch (error) {
    logMessage(`Error when loging in: ${error}`)
  }
}

const sendTransactions = async () => {
  const args = process.argv

  const sendBulkTransactions = args.some((arg) => arg === 'bulk')
  const sendDagTransaction = args.some((arg) => arg === 'dag')

  const seedWords = args.find((arg) => arg.includes('--seed='))
  const transaction = args.find((arg) => arg.includes('--transaction='))
  const config = args.find((arg) => arg.includes('--config='))

  if (sendBulkTransactions && !config) {
    logMessage(
      '--config parameter (transactions file path) must be provided for bulk transactions execution',
    )
    return
  }

  if (!sendBulkTransactions && (!seedWords || !transaction)) {
    logMessage(
      '--seed and --transaction are required parameters for single transaction execution',
    )
    return
  }

  const metagraphId = process.env.METAGRAPH_ID
  const l0GlobalUrl = process.env.L0_GLOBAL_URL
  const l0CurrencyUrl = process.env.L0_CURRENCY_URL
  const l1CurrencyUrl = process.env.L1_CURRENCY_URL
  const l1DagUrl = process.env.L1_DAG_URL

  if (!metagraphId) {
    logMessage('You should provide the METAGRAPH_ID on .env file')
    return
  }

  if (!l0GlobalUrl) {
    logMessage('You should provide the L0_GLOBAL_URL on .env file')
    return
  }

  if (!l0CurrencyUrl) {
    logMessage('You should provide the L0_CURRENCY_URL on .env file')
    return
  }

  if (!l1CurrencyUrl) {
    logMessage('You should provide the L1_CURRENCY_URL on .env file')
    return
  }

  const networkOptions = {
    metagraphId,
    l0GlobalUrl,
    l0CurrencyUrl,
    l1CurrencyUrl,
    l1DagUrl,
  }

  if (seedWords && transaction) {
    const seedWordsParsed = seedWords.replace('--seed=', '')
    const transactionParsed = transaction.replace('--transaction=', '')

    await handleSingleTransaction(
      seedWordsParsed,
      transactionParsed,
      networkOptions,
      sendDagTransaction,
    )
    return
  }

  if (config) {
    const configPath = config.replace('--config=', '')

    try {
      const data = fs.readFileSync(configPath, 'utf8')
      const configParsed = JSON.parse(data)
      handleBatchTransactions(
        configParsed.seed,
        configParsed.transactions,
        networkOptions,
        sendDagTransaction,
      )
      return
    } catch (e) {
      logMessage(`Error when reading file: ${e}`)
    }
  }
}

sendTransactions()
