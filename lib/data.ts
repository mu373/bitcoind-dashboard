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

export async function getElectrumVersion() {
  let electrumClient = new ElectrumClient(ELECTRUM_PORT, ELECTRUM_HOST, "tcp");
  const initClient = await electrumClient.initElectrum(electrumConfig);
  const version = initClient.versionInfo[0]
  return version;
}

export async function getElectrumBlockHeight() {
  const electrumClient = new ElectrumClient(ELECTRUM_PORT, ELECTRUM_HOST, "tcp");
  const initClient = await electrumClient.initElectrum(electrumConfig);
  const headers = await initClient.blockchainHeaders_subscribe();
  const height = headers.height
  console.log(height)
  return height;
}

export async function getBlockInfo() {
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
}

export async function getConnectionCount() {
  const json = await getAPI(cfg, 'getconnectioncount');
  return ( json.result.result )
}

export async function getNetworkInfo() {
  const json = await getAPI(cfg, 'getnetworkinfo');
  return ( json.result )
}

export async function getMiningInfo() {
  const json = await getAPI(cfg, 'getmininginfo');
  const res = json.result;
  return {
      hashrate: res.networkhashps,
  }
}

export async function getMempoolInfo() {
  const json = await getAPI(cfg, 'getmempoolinfo');
  const res = json.result;
  return {
    transactions: res.size,
    usage: res.usage,
    totalFee: res.total_fee,
    minFee: res.mempoolminfee,
  }
}

export async function getCurrentBlock() {
  const url = 'https://blockchain.info/latestblock';
  const response = await fetch(url);
  const data = await response.json();
  return ( data.height );
}

export async function getCurrentChainSize() {
  const url = 'https://api.blockchain.info/charts/blocks-size?timespan=1days'
  const response = await fetch(url);
  const dataJson = await response.json();
  const data = dataJson.values[0];
  const date = data.x
  const size = data.y
  return ( {date: date, chainSize: size } )
}