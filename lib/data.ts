interface BitcoindConfig {
  user: any;
  password: any;
  host: any;
  port: any;
}

const cfg: BitcoindConfig = {
  user: process.env.RPC_USER,
  password: process.env.RPC_PASSWORD,
  host: process.env.BITCOIND_HOST,
  port: process.env.BITCOIND_PORT
};

async function getAPI(cfg: BitcoindConfig, method: string) {
  const url = `http://${cfg.host}:${cfg.port}/`;
  const credentials = btoa(`${cfg.user}:${cfg.password}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    },
    body: JSON.stringify({
      jsonrpc: '1.0',
      id: 'test',
      method,
      params: [],
    }),
  });

  const data = await response.json();
  return data;
}

const ElectrumClient = require("@lily-technologies/electrum-client");
const ELECTRUM_HOST = process.env.ELECTRUM_HOST || "electrs";
const ELECTRUM_PORT = process.env.ELECTRUM_PORT || 50001;
const electrumConfig = {
  client: "dashboard",
  version: "1.4",
}

const electrumPersistencePolicy = {
  retryPeriod: 10000,
  maxRetry: 3,
  pingPeriod: 120000,
  callback: null
}

export async function getBitcoindHostInfo() {
  return { host: process.env.BITCOIND_HOST, port: process.env.BITCOIND_PORT }
}

export async function getElectrumHostInfo() {
  return { host: process.env.ELECTRUM_HOST, port: process.env.ELECTRUM_PORT }
}

export async function getElectrumVersion() {
  try {
    let electrumClient = new ElectrumClient(ELECTRUM_PORT, ELECTRUM_HOST, "tcp");
    const initClient = await electrumClient.initElectrum(electrumConfig, electrumPersistencePolicy);
    const version = initClient.versionInfo[0]
    return version;
  } catch (error) {
    console.error("Error loading data from Electrum server:", error);
    return null;
  }
}

export async function getElectrumBlockHeight() {
  try {
    const electrumClient = new ElectrumClient(ELECTRUM_PORT, ELECTRUM_HOST, "tcp");
    const initClient = await electrumClient.initElectrum(electrumConfig);
    const headers = await initClient.blockchainHeaders_subscribe();
    const height = headers.height
    return height;
  } catch (error) {
    console.error("Error loading data from Electrum server:", error);
    return null;
  }
}

export async function getBlockInfo() {
  try {
    const json = await getAPI(cfg, 'getblockchaininfo');
    const res = json.result;
    return {
      chain: res.chain,
      blocks: res.blocks,
      chainSize: res.size_on_disk,
      verificationProgress: res.verificationprogress,
      pruned: res.pruned,
      difficulty: res.difficulty,
    }
  } catch (error) {
    console.error("Error loading data from bitcoind", error);
    return {
      chain: null,
      blocks: null,
      chainSize: null,
      verificationProgress: null,
      pruned: null,
      difficulty: null,
    }
  }
}

export async function getConnectionCount() {
  try {
    const json = await getAPI(cfg, 'getconnectioncount');
    return ( json.result.result )
  } catch (error) {
    console.error("Error loading data from bitcoind", error);
    return null;
  }
}

export async function getNetworkInfo() {
  try {
    const json = await getAPI(cfg, 'getnetworkinfo');
    return ( json.result )
  } catch (error) {
    console.error("Error loading data from bitcoind", error);
    return null;
  }
}

export async function getMiningInfo() {
  try {
    const json = await getAPI(cfg, 'getmininginfo');
    const res = json.result;
    return {
      hashrate: res.networkhashps
    }
  } catch (error) {
    console.error("Error loading data from bitcoind", error);
    return {
      hashrate: null
    }
  }
}

export async function getMempoolInfo() {
  try {
    const json = await getAPI(cfg, 'getmempoolinfo');
    const res = json.result;
    return {
      transactions: res.size,
      usage: res.usage,
      totalFee: res.total_fee,
      minFee: res.mempoolminfee,
    }
  } catch (error) {
    console.error("Error loading data from bitcoind", error);
    return {
      transactions: null,
      usage: null,
      totalFee: null,
      minFee: null
    }
  }
}

export async function getCurrentBlock() {
  try {
    const url = 'https://blockchain.info/latestblock';
    const response = await fetch(url);
    const data = await response.json();
    return ( data.height );
  } catch (error) {
    console.error("Error loading data from blockchain.info API", error);
    return null
  }
}

export async function getCurrentChainSize() {
  try {
    const url = 'https://api.blockchain.info/charts/blocks-size?timespan=1days'
    const response = await fetch(url);
    const dataJson = await response.json();
    const data = dataJson.values[0];
    const date = data.x
    const size = data.y
    return (
      {
        date: date,
        chainSize: size
      }
    )
  } catch (error) {
    console.error("Error loading data from blockchain.info API", error);
    return {
      date: null,
      chainSize: null
    }
  }
}