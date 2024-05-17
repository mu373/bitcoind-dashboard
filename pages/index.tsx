import Head from 'next/head'
import React, {useEffect} from 'react';
const ProgressBar = require('progressbar.js')

import { BlockchainPanel, MempoolPanel, NodePanel, ElectrumPanel } from '../components/DashboardPanels';

import {
  getElectrumVersion, 
  getElectrumBlockHeight, 
  getBlockInfo, 
  getConnectionCount, 
  getNetworkInfo, 
  getMiningInfo, 
  getMempoolInfo, 
  getCurrentBlock, 
  getCurrentChainSize
} from '../lib/data';

export async function getServerSideProps() {
  const blockInfo = await getBlockInfo()
  const currentBlock = await getCurrentBlock()
  const miningInfo = await getMiningInfo()
  const currentChainSize = await getCurrentChainSize()
  const networkInfo = await getNetworkInfo()
  const mempoolInfo = await getMempoolInfo()

  const electrumVersion = await getElectrumVersion();
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

      bitcoindHost: process.env.BITCOIND_HOST,
      bitcoindPort: process.env.BITCOIND_PORT,
      subversion: networkInfo.subversion,
      connectionTotalCount: networkInfo.connections,
      connectionInCount: networkInfo.connections_in,
      connectionOutCount: networkInfo.connections_out,

      electrumHost: process.env.ELECTRUM_HOST,
      electrumPort: process.env.ELECTRUM_PORT,
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
  bitcoindHost,
  bitcoindPort,
  subversion,
  connectionTotalCount,
  connectionInCount,
  connectionOutCount,
  electrumHost,
  electrumPort,
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

  return (
    <div className="main btc-dashboard">
      <Head><title> Dashboard</title></Head>
      <div className="section">
        <h1>Dashboard</h1>

        <div className="panels">

          <BlockchainPanel data={{
            syncPercentage: syncPercentage,
            chain: chain,
            blocks: blocks,
            currentBlock: currentBlock,
            verificationProgress: verificationProgress,
            chainSize: chainSize,
            currentChainSize: chainSize,
            difficulty: difficulty,
            pruned: pruned,
          }}></BlockchainPanel>

          {/* <MempoolPanel
            data={{
              mempoolTransactions: mempoolTransactions,
              mempoolUsage: mempoolUsage,
              totalFee: totalFee
            }}>
          </MempoolPanel> */}

          <NodePanel
            data={{
              bitcoindHost: bitcoindHost,
              bitcoindPort: bitcoindPort,
              subversion: subversion.replace(/\//g, ""),
              connectionTotalCount: connectionTotalCount,
              connectionInCount: connectionInCount,
              connectionOutCount: connectionOutCount
            }}>
          </NodePanel>

          <ElectrumPanel
            data={{
              electrumHost: electrumHost,
              electrumPort: electrumPort,
              electrumVersion: electrumVersion,
              electrumBlockHeight: electrumBlockHeight
            }}>
          </ElectrumPanel>

        </div>
      </div>
    </div>
  );
};

export default BlockInfo;
