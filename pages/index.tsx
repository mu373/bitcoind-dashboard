import Head from 'next/head'
import React, { useEffect, useState } from 'react';
const ProgressBar = require('progressbar.js')

import { BlockchainPanel, MempoolPanel, NodePanel, ElectrumPanel } from '../components/DashboardPanels';

import { fetchWithRetry } from '../lib/utils'

export async function getServerSideProps() {
  const dashboardConfig = {
    enableElectrumPanel: process.env.ENABLE_ELECTRUM_PANEL === "TRUE",
    enableMempoolPanel: process.env.ENABLE_MEMPOOL_PANEL === "TRUE",
  };

  return {
    props: {
      defaultDashboardConfig: dashboardConfig,
    },
  };
}

const BlockInfo: React.FC<{ defaultDashboardConfig: any }> = ({ defaultDashboardConfig }) => {

  const [dashboardConfig, setDashboardConfig] = useState(defaultDashboardConfig);

  const [dashboardData, setDashboardData] = useState({
    bitcoindHost: null as string | null,
    bitcoindPort: null as number | null,
    currentBlock: null as number | null,
    chain: null as string | null,
    blocks: null as number | null,
    verificationProgress: null as number | null,
    chainSize: null as number | null,
    pruned: null as boolean | null,
    difficulty: null as number | null,
    mempoolTransactions: null as number | null,
    mempoolUsage: null as number | null,
    totalFee: null as number | null,
    minFee: null as number | null,
    hashrate: null as number | null,
    currentChainSize: null as number | null,
    subversion: null as string | null,
    connectionTotalCount: null as number | null,
    connectionInCount: null as number | null,
    connectionOutCount: null as number | null,
    electrumHost: null as string | null,
    electrumPort: null as number | null,
    electrumVersion: null as string | null,
    electrumBlockHeight: null as number | null,
    syncPercentage: 0 as number,
  });

  useEffect(() => {

    const fetchBitcoindHostInfo = async () => {
      try {
        const response = await fetchWithRetry('/api/data?method=getBitcoindHostInfo');
        const bitcoindHostData = await response.json();
        setDashboardData(prevData => ({
          ...prevData,
          bitcoindHost: bitcoindHostData.host,
          bitcoindPort: bitcoindHostData.port,
        }));
      } catch (error) {
        console.error('Error fetching bitcoind host:', error);
      }
    };

    const fetchBlockInfo = async () => {
      try {
        const response = await fetchWithRetry('/api/data?method=getBlockInfo');
        const blockInfo = await response.json();
        setDashboardData(prevData => ({
          ...prevData,
          chain: blockInfo.chain,
          blocks: blockInfo.blocks,
          verificationProgress: blockInfo.verificationProgress,
          pruned: blockInfo.pruned,
          difficulty: blockInfo.difficulty,
          chainSize: blockInfo.chainSize / (1024 ** 3),
        }));
      } catch (error) {
        console.error('Error fetching block info:', error);
      }
    };

    const fetchCurrentBlock = async () => {
      try {
        const response = await fetchWithRetry('/api/data?method=getCurrentBlock');
        const currentBlockData = await response.json();
        setDashboardData(prevData => ({
          ...prevData,
          currentBlock: currentBlockData.height,
        }));
      } catch (error) {
        console.error('Error fetching current block:', error);
      }
    };

    const fetchMiningInfo = async () => {
      try {
        const response = await fetchWithRetry('/api/data?method=getMiningInfo');
        const miningInfo = await response.json();
        setDashboardData(prevData => ({
          ...prevData,
          hashrate: miningInfo.hashrate,
        }));
      } catch (error) {
        console.error('Error fetching mining info:', error);
      }
    };

    const fetchCurrentChainSize = async () => {
      try {
        const response = await fetchWithRetry('/api/data?method=getCurrentChainSize');
        const currentChainSizeData = await response.json();
        setDashboardData(prevData => ({
          ...prevData,
          currentChainSize: currentChainSizeData.chainSize / 1000,
        }));
      } catch (error) {
        console.error('Error fetching current chain size:', error);
      }
    };

    const fetchNetworkInfo = async () => {
      try {
        const response = await fetchWithRetry('/api/data?method=getNetworkInfo');
        const networkInfo = await response.json();
        setDashboardData(prevData => ({
          ...prevData,
          subversion: networkInfo.subversion,
          connectionTotalCount: networkInfo.connections,
          connectionInCount: networkInfo.connections_in,
          connectionOutCount: networkInfo.connections_out,
        }));
      } catch (error) {
        console.error('Error fetching network info:', error);
      }
    };

    const fetchMempoolInfo = async () => {
      try {
        const response = await fetchWithRetry('/api/data?method=getMempoolInfo');
        const mempoolInfo = await response.json();
        setDashboardData(prevData => ({
          ...prevData,
          mempoolTransactions: mempoolInfo.transactions,
          mempoolUsage: mempoolInfo.usage,
          totalFee: mempoolInfo.totalFee,
          minFee: mempoolInfo.minFee,
        }));
      } catch (error) {
        console.error('Error fetching mempool info:', error);
      }
    };

    const fetchElectrumVersion = async () => {
      try {
        const response = await fetchWithRetry('/api/data?method=getElectrumVersion');
        const electrumVersionData = await response.json();
        setDashboardData(prevData => ({
          ...prevData,
          electrumVersion: electrumVersionData.version,
        }));
      } catch (error) {
        console.error('Error fetching Electrum version:', error);
      }
    };

    const fetchElectrumHost = async () => {
      try {
        const response = await fetchWithRetry('/api/data?method=getElectrumHostInfo');
        const electrumHostData = await response.json();
        setDashboardData(prevData => ({
          ...prevData,
          electrumHost: electrumHostData.host,
          electrumPort: electrumHostData.port,
        }));
      } catch (error) {
        console.error('Error fetching Electrum version:', error);
      }
    };

    const fetchElectrumBlockHeight = async () => {
      try {
        const response = await fetchWithRetry('/api/data?method=getElectrumBlockHeight');
        const electrumBlockHeightData = await response.json();
        setDashboardData(prevData => ({
          ...prevData,
          electrumBlockHeight: electrumBlockHeightData.height,
        }));
      } catch (error) {
        console.error('Error fetching Electrum block height:', error);
      }
    };

    fetchBitcoindHostInfo();
    fetchBlockInfo();
    fetchCurrentBlock();
    fetchMiningInfo();
    fetchCurrentChainSize();
    fetchNetworkInfo();
    fetchMempoolInfo();

    if (dashboardConfig.enableElectrumPanel) {
      fetchElectrumHost();
      fetchElectrumVersion();
      fetchElectrumBlockHeight();
    }

  }, []);

  useEffect(() => {
    if (dashboardData.blocks !== null && dashboardData.currentBlock !== null) {
      setDashboardData(prevData => ({
        ...prevData,
        syncPercentage: dashboardData.blocks! / dashboardData.currentBlock!,
      }));
    }
  }, [dashboardData.blocks, dashboardData.currentBlock]);

  useEffect(() => {
    if (dashboardData.syncPercentage !== 0) {
      const bar = new ProgressBar.Line(document.getElementById('progressbarContainer'), {
        easing: 'easeInOut',
        duration: 500,
        color: "rgb(30 166 114)",
        trailColor: '#dad6d5',
        strokeWidth: 3,
        trailWidth: 3,
      });

      bar.animate(dashboardData.syncPercentage);
    }
  }, [dashboardData.syncPercentage]);

  return (
    <div className="main btc-dashboard">
      <Head><title>Dashboard</title></Head>
      <div className="section">
        <h1>Dashboard</h1>

        <div className="panels">
          <BlockchainPanel data={dashboardData}></BlockchainPanel>
          { dashboardConfig.enableMempoolPanel &&  <MempoolPanel data={dashboardData}></MempoolPanel> }
          <NodePanel data={dashboardData}></NodePanel>
          { dashboardConfig.enableElectrumPanel && <ElectrumPanel data={dashboardData}></ElectrumPanel>}
          
        </div>
      </div>
    </div>
  );
};

export default BlockInfo;