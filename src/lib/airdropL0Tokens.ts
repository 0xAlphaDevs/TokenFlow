import { dag4 } from "@stardust-collective/dag4";
import {
  DagAccount,
  MetagraphTokenClient,
  KeyStore,
} from "@stardust-collective/dag4-wallet";

import dotenv from "dotenv";
dotenv.config();

type TransactionInfoProps = {
  destination: string;
  amount: number;
  fee: number;
};

type NetworkOptions = {
  metagraphId: string;
  l0GlobalUrl: string;
  l0CurrencyUrl: string;
  l1CurrencyUrl: string;
  l1DagUrl?: string;
};

const logMessage = (message: string) => {
  const formattedMessage = {
    message,
  };
  console.log(formattedMessage);
};

const batchMetagraphTransaction = async (
  metagraphTokenClient: MetagraphTokenClient,
  account: DagAccount,
  transactionsInfo: TransactionInfoProps[]
) => {
  try {
    const txnsData = [];
    for (const transaction of transactionsInfo) {
      const txnBody = {
        address: transaction.destination,
        amount: transaction.amount,
        fee: transaction.fee,
      };

      logMessage(
        `Transaction from: ${account.address} to ${transaction.destination}} - batch.`
      );

      txnsData.push(txnBody);
    }

    const generatedTransactions =
      await metagraphTokenClient.generateBatchTransactions(txnsData);

    const hashes = await metagraphTokenClient.sendBatchTransactions(
      generatedTransactions
    );

    logMessage(
      `Transaction from: ${
        account.address
      } sent - batch. Generated transaction response body: ${JSON.stringify(
        generatedTransactions
      )}. Post hashes: ${hashes}`
    );

    return hashes;
  } catch (e) {
    throw Error(`Error when sending batch transaction: ${e}`);
  }
};

const handleBatchTransactions = async (
  seedWords: string,
  transactions: TransactionInfoProps[],
  networkOptions: NetworkOptions,
  sendDagTransaction: boolean
) => {
  try {
    const account = dag4.createAccount();
    await account.loginSeedPhrase(seedWords);

    account.connect(
      {
        networkVersion: "2.0",
        l0Url: networkOptions.l0GlobalUrl,
        l1Url: networkOptions.l1DagUrl,
      },
      true
    );
    try {
      const metagraphTokenClient = account.createMetagraphTokenClient({
        id: networkOptions.metagraphId,
        l0Url: networkOptions.l0CurrencyUrl,
        l1Url: networkOptions.l1CurrencyUrl,
        beUrl: "",
        metagraphId: "",
      });

      await batchMetagraphTransaction(
        metagraphTokenClient,
        account,
        transactions
      );
      return;
    } catch (error) {
      const errorMessage = `Error when sending transactions between wallets, message: ${error}`;
      logMessage(errorMessage);
    }
  } catch (error) {
    logMessage(`Error when loging in: ${error}`);
  }
};

export const airdropL0Tokens = async () => {
  const seedWords = process.env.NEXT_PUBLIC_SEED_WORDS || "";

  console.log("seedWords", seedWords);

  const metagraphId = process.env.NEXT_PUBLIC_METAGRAPH_ID;
  const l0GlobalUrl = process.env.NEXT_PUBLIC_L0_GLOBAL_URL;
  const l0CurrencyUrl = process.env.NEXT_PUBLIC_L0_CURRENCY_URL;
  const l1CurrencyUrl = process.env.NEXT_PUBLIC_L1_CURRENCY_URL;
  const l1DagUrl = process.env.NEXT_PUBLIC_L1_DAG_URL;

  console.log("metagraphId", metagraphId);

  if (!metagraphId) {
    return {
      error: true,
      message: "You should provide the METAGRAPH_ID on .env file",
    };
  }

  if (!l0GlobalUrl) {
    return {
      error: true,
      message: "You should provide the L0_GLOBAL_URL on .env file",
    };
  }

  if (!l0CurrencyUrl) {
    return {
      error: true,
      message: "You should provide the L0_CURRENCY_URL on .env file",
    };
  }

  if (!l1CurrencyUrl) {
    return {
      error: true,
      message: "You should provide the L1_CURRENCY_URL on .env file",
    };
  }

  const networkOptions = {
    metagraphId,
    l0GlobalUrl,
    l0CurrencyUrl,
    l1CurrencyUrl,
    l1DagUrl,
  };

  // PARAMS
  const transactions: TransactionInfoProps[] = [
    {
      destination: "DAG4o41NzhfX6DyYBTTXu6sJa6awm36abJpv89jB",
      amount: 11,
      fee: 0,
    },
    {
      destination: "DAG8pkb7EhCkT3yU87B2yPBunSCPnEdmX2Wv24sZ",
      amount: 5,
      fee: 1,
    },
  ];
  try {
    handleBatchTransactions(seedWords, transactions, networkOptions, false);
    return;
  } catch (e) {
    logMessage(`Error when reading file: ${e}`);
  }
};


export const generateWallets = async () => {

