import Head from 'next/head'
import React, {useEffect} from 'react';
const ProgressBar = require('progressbar.js')

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

const net = require('net')
const ElectrumClient = require("@lily-technologies/electrum-client");
const ELECTRUM_HOST = process.env.ELECTRUM_HOST || "electrs";
const ELECTRUM_PORT = process.env.ELECTRUM_PORT || 50001;
const electrumConfig = {
    client: "dashboard",
    version: "1.4",
}

async function getElectrumVersion() {
    let electrumClient = new ElectrumClient(ELECTRUM_PORT, ELECTRUM_HOST, "tcp");
    const initClient = await electrumClient.initElectrum(electrumConfig);
    const version = initClient.versionInfo[0]
    return version;
}

async function getElectrumBlockHeight() {
    const electrumClient = new ElectrumClient(ELECTRUM_PORT, ELECTRUM_HOST, "tcp");
    const initClient = await electrumClient.initElectrum(electrumConfig);
    const headers = await initClient.blockchainHeaders_subscribe();
    const height = headers.height
    console.log(height)
    return height;
}

async function getBlockInfo() {
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

async function getConnectionCount() {
    const json = await getAPI(cfg, 'getconnectioncount');
    return ( json.result.result )
}

async function getNetworkInfo() {
    const json = await getAPI(cfg, 'getnetworkinfo');
    return ( json.result )
}

async function getMiningInfo() {
    const json = await getAPI(cfg, 'getmininginfo');
    const res = json.result;
    return {
        hashrate: res.networkhashps,
    }
}

async function getMempoolInfo() {
  const json = await getAPI(cfg, 'getmempoolinfo');
  const res = json.result;
  return {
      transactions: res.size,
      usage: res.usage,
      totalFee: res.total_fee,
      minFee: res.mempoolminfee,
  }
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function decimalFloor(value: number, base: number) {
    return Math.floor(value * base) / base;
}

async function getCurrentBlock() {
  const url = 'https://blockchain.info/latestblock';
  const response = await fetch(url);
  const data = await response.json();
  return ( data.height );
}

//
async function getCurrentChainSize() {
  const url = 'https://api.blockchain.info/charts/blocks-size?timespan=1days'
  const response = await fetch(url);
  const dataJson = await response.json();
  const data = dataJson.values[0];
  const date = data.x
  const size = data.y
  return ( {date: date, chainSize: size } )
}

export async function getServerSideProps() {
    const blockInfo = await getBlockInfo()
    const currentBlock = await getCurrentBlock()
    const miningInfo = await getMiningInfo()
    const currentChainSize = await getCurrentChainSize()
    const networkInfo = await getNetworkInfo()
    const mempoolInfo = await getMempoolInfo()
    const electrumVersion = await getElectrumVersion()
    const electrumBlockHeight = await getElectrumBlockHeight();
    return {
      props: {
        currentBlock: currentBlock,

        chain: blockInfo.chain,
        blocks: blockInfo.blocks,
        verificationProgress: blockInfo.verificationProgress,
        syncPercentage: blockInfo.blocks / currentBlock,
        chainSize: blockInfo.chainSize / (1024**3), // byte to GB
        pruned: blockInfo.pruned,
        difficulty: blockInfo.difficulty,

        mempoolTransactions: mempoolInfo.transactions,
        mempoolUsage: mempoolInfo.usage,
        totalFee: mempoolInfo.totalFee,
        minFee: mempoolInfo.minFee,

        hashrate: miningInfo.hashrate,

        currentChainSize: (currentChainSize.chainSize / 1024),

        subversion: networkInfo.subversion,
        connectionTotalCount: networkInfo.connections,
        connectionInCount: networkInfo.connections_in,
        connectionOutCount: networkInfo.connections_out,

        electrumVersion: electrumVersion,
        electrumBlockHeight: electrumBlockHeight

    },
    };
}


const BlockInfo: React.FC<any> = ({
    currentBlock,
    chain,
    blocks,
    verificationProgress,
    pruned,
    difficulty,
    mempoolTransactions,
    mempoolUsage,
    totalFee,
    minFee,
    syncPercentage,
    chainSize,
    hashrate,
    currentChainSize,
    subversion,
    connectionTotalCount,
    connectionInCount,
    connectionOutCount,
    electrumVersion,
    electrumBlockHeight,
}) => {
    
  useEffect(() => {

      const bar = new ProgressBar.Line(document.getElementById('progressbarContainer'), {
        easing: 'easeInOut',
        duration: 500,
        color: "rgb(30 166 114)",
        trailColor: '#dad6d5',
        strokeWidth: 3,
        trailWidth: 3,
      });
      bar.animate(syncPercentage);
  }, [])

  // const hostname = process.env.BITCOIND_HOST 

  return (
    <div className="main btc-dashboard">
        <Head><title> Dashboard</title></Head>
        <div className="section">
          <h1>Dashboard</h1>

          <div className="panels">

            <div className="panel">
              <h2 className="panel-title">Blockchain</h2>
              
                <div className="mb-s">
                  <p>Synchronized (based on block count)</p>
                  <p className="sync-progress"><span className="sync-progress-num">{decimalFloor(syncPercentage * 100, 10)}</span>%</p>
                  <div id="progressbarContainer"></div>
                </div>

                <dl>
                  <dt>Chain</dt>
                  <dd>{capitalizeFirstLetter(chain)}</dd>
                  <dt>Synced blocks</dt>
                  <dd>{blocks.toLocaleString()}</dd>
                  <dt>Latest block</dt>
                  <dd>{currentBlock.toLocaleString()}</dd>
                  <dt>Verified</dt>
                  <dd>{decimalFloor(verificationProgress * 100, 10)} %</dd>
                  <dt>Size on disk</dt>
                  <dd>{chainSize.toFixed(1)} GB</dd>
                  <dt>Blockchain size</dt>
                  <dd>{currentChainSize.toFixed(1)} GB</dd>
                  <dt>Difficulty</dt>
                  <dd>{(difficulty / 10**12).toFixed(2)} T</dd>
                  <dt>Pruned</dt>
                  <dd>{capitalizeFirstLetter(pruned.toString())}</dd>
                </dl>

            </div>

            {/* <div className="panel">
              <h2 className="panel-title">Mempool</h2>
              
                <dl>
                  <dt>Transactions</dt>
                  <dd>{mempoolTransactions.toLocaleString()}</dd>
                  <dt>Size</dt>
                  <dd>{(mempoolUsage).toLocaleString()}</dd>
                  <dt>Total Fee</dt>
                  <dd>{totalFee}</dd>
                </dl>
            </div> */}

            <div className="panel">
              <h2 className="panel-title">Node</h2>
              
                <dl>
                  <dt>Host</dt>
                  <dd>{process.env.BITCOIND_HOST}:{process.env.BITCOIND_PORT}</dd>
                  <dt>Version</dt>
                  <dd>{subversion.replace(/\//g, "")}</dd>
                  <dt>Connections</dt>
                  <dd>{connectionTotalCount} ({connectionInCount}-in {connectionOutCount}-out)</dd>
                </dl>
            </div>

            <div className="panel">
              <h2 className="panel-title">Electrum Server</h2>
              
                <dl>
                  <dt>Host</dt>
                  <dd>{ELECTRUM_HOST}:{ELECTRUM_PORT}</dd>
                  <dt>Version</dt>
                  <dd>{electrumVersion}</dd>
                  <dt>Block height</dt>
                  <dd>{electrumBlockHeight.toLocaleString()}</dd>
                  <dt>Indexed</dt>
                  <dd>{decimalFloor(electrumBlockHeight / blocks * 100, 10)} %</dd>
                </dl>
            </div>

          </div>
        </div>
    </div>
  );
};

export default BlockInfo;

