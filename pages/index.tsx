import Head from 'next/head'
import React, {useEffect, useState } from 'react';
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
  const props = {
    currentBlock: 0,
    chain: null,
    blocks: null,
    verificationProgress: null,
    syncPercentage: 0,
    chainSize: 0,
    pruned: null,
    difficulty: null,
    mempoolTransactions: null,
    mempoolUsage: null,
    totalFee: null,
    minFee: null,
    hashrate: null,
    currentChainSize: 0,
    bitcoindHost: process.env.BITCOIND_HOST,
    bitcoindPort: process.env.BITCOIND_PORT,
    subversion: null,
    connectionTotalCount: 0,
    connectionInCount: 0,
    connectionOutCount: 0,
    enableElectrumPanel: process.env.ENABLE_ELECTRUM_PANEL === 'TRUE',
    electrumHost: process.env.ELECTRUM_HOST,
    electrumPort: process.env.ELECTRUM_PORT,
    electrumVersion: null,
    electrumBlockHeight: null,
  };

  try {
    const blockInfo = await getBlockInfo();
    props.chain = blockInfo.chain;
    props.blocks = blockInfo.blocks;
    props.verificationProgress = blockInfo.verificationProgress;
    props.pruned = blockInfo.pruned;
    props.difficulty = blockInfo.difficulty;
    props.chainSize = blockInfo.chainSize / (1024 ** 3);
  } catch (error) {
    console.error('Error fetching block info:', error);
  }

  try {
    const currentBlock = await getCurrentBlock();
    props.currentBlock = currentBlock;
    props.syncPercentage = props.blocks !== null ? props.blocks / currentBlock : 0;
  } catch (error) {
    console.error('Error fetching current block:', error);
  }

  try {
    const miningInfo = await getMiningInfo();
    props.hashrate = miningInfo.hashrate;
  } catch (error) {
    console.error('Error fetching mining info:', error);
  }

  try {
    const currentChainSize = await getCurrentChainSize();
    props.currentChainSize = currentChainSize.chainSize / 1024;
  } catch (error) {
    console.error('Error fetching current chain size:', error);
  }

  try {
    const networkInfo = await getNetworkInfo();
    props.subversion = networkInfo.subversion;
    props.connectionTotalCount = networkInfo.connections;
    props.connectionInCount = networkInfo.connections_in;
    props.connectionOutCount = networkInfo.connections_out;
  } catch (error) {
    console.error('Error fetching network info:', error);
  }

  try {
    const mempoolInfo = await getMempoolInfo();
    props.mempoolTransactions = mempoolInfo.transactions;
    props.mempoolUsage = mempoolInfo.usage;
    props.totalFee = mempoolInfo.totalFee;
    props.minFee = mempoolInfo.minFee;
  } catch (error) {
    console.error('Error fetching mempool info:', error);
  }

  try {
    const electrumVersion = await getElectrumVersion();
    props.electrumVersion = electrumVersion;
  } catch (error) {
    console.error('Error fetching Electrum version:', error);
  }

  try {
    const electrumBlockHeight = await getElectrumBlockHeight();
    props.electrumBlockHeight = electrumBlockHeight;
  } catch (error) {
    console.error('Error fetching Electrum block height:', error);
  }

  return { props };
}

const BlockInfo: React.FC<any> = (props) => {

  const { enableElectrumPanel } = props;

  useEffect(() => {
    if (props.syncPercentage !== null) {
      const bar = new ProgressBar.Line(document.getElementById('progressbarContainer'), {
        easing: 'easeInOut',
        duration: 500,
        color: "rgb(30 166 114)",
        trailColor: '#dad6d5',
        strokeWidth: 3,
        trailWidth: 3,
      });

      bar.animate(props.syncPercentage);
    }
  }, [props.syncPercentage]);
    
  return (
    <div className="main btc-dashboard">
      <Head><title> Dashboard</title></Head>
      <div className="section">
        <h1>Dashboard</h1>

        <div className="panels">

          <BlockchainPanel data={props}></BlockchainPanel>

          {/* <MempoolPanel
            data={{
              mempoolTransactions: mempoolTransactions,
              mempoolUsage: mempoolUsage,
              totalFee: totalFee
            }}>
          </MempoolPanel> */}

          <NodePanel data={props}></NodePanel>

          <ElectrumPanel data={props}></ElectrumPanel>

        </div>
      </div>
    </div>
  );
};

export default BlockInfo;
