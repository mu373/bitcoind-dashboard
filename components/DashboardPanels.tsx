import React from 'react';

import { capitalizeFirstLetter, decimalFloor } from '../lib/utils';

const formatValue = (value) => {
  if (value === undefined || value === null) {
    return '-'
  } else {
    return value
  }
};

export const BlockchainPanel: React.FC<{ data: any }> = ({ data }) => {
    return (
      <div className="panel">
        <h2 className="panel-title">Blockchain</h2>
        <div className="mb-s">
          <p>Synchronized (based on block count)</p>
          <p className="sync-progress">
            <span className="sync-progress-num">
              {formatValue(data.syncPercentage && decimalFloor(data.syncPercentage * 100, 10))}
            </span>%
          </p>
          <div id="progressbarContainer"></div>
        </div>
        <dl>
          <dt>Chain</dt>
          <dd>{formatValue(data.chain && capitalizeFirstLetter(data.chain))}</dd>
          <dt>Synced blocks</dt>
          <dd>{formatValue(data.blocks && data.blocks.toLocaleString())}</dd>
          <dt>Latest block</dt>
          <dd>{formatValue(data.currentBlock && data.currentBlock.toLocaleString())}</dd>
          <dt>Verified</dt>
          <dd>
            {formatValue(data.verificationProgress && decimalFloor(data.verificationProgress * 100, 10))} %
          </dd>
          <dt>Size on disk</dt>
          <dd>{formatValue(data.chainSize && data.chainSize.toFixed(1))} GB</dd>
          <dt>Blockchain size</dt>
          <dd>{formatValue(data.currentChainSize && data.currentChainSize.toFixed(1))} GB</dd>
          <dt>Difficulty</dt>
          <dd>{formatValue(data.difficulty && (data.difficulty / 10 ** 12).toFixed(2))} T</dd>
          <dt>Pruned</dt>
          <dd>{formatValue(data.pruned !== null && capitalizeFirstLetter(data.pruned.toString()))}</dd>
        </dl>
      </div>
    );
  };
  
export const MempoolPanel: React.FC<{ data: any }> = ({ data }) => {
return (
    <div className="panel">
    <h2 className="panel-title">Mempool</h2>
    <dl>
        <dt>Transactions</dt>
        <dd>{formatValue(data.mempoolTransactions && data.mempoolTransactions.toLocaleString())}</dd>
        <dt>Size</dt>
        <dd>{formatValue(data.mempoolUsage && data.mempoolUsage.toLocaleString())}</dd>
        <dt>Total Fee</dt>
        <dd>{formatValue(data.totalFee)}</dd>
    </dl>
    </div>
)
};

export const NodePanel: React.FC<{ data: any }> = ({ data }) => {
return (
    <div className="panel">
    <h2 className="panel-title">Node</h2>
    <dl>
        <dt>Host</dt>
        <dd>{formatValue(data.bitcoindHost)}:{formatValue(data.bitcoindPort)}</dd>
        <dt>Version</dt>
        <dd>{formatValue(data.subversion && data.subversion.replace(/\//g, ""))}</dd>
        <dt>Connections</dt>
        <dd>{formatValue(data.connectionTotalCount)} ({formatValue(data.connectionInCount)}-in {formatValue(data.connectionOutCount)}-out)</dd>
    </dl>
    </div>
)
};

export const ElectrumPanel: React.FC<{ data: any }> = ({ data }) => {
return (
    <div className="panel">
    <h2 className="panel-title">Electrum Server</h2>
    <dl>
        <dt>Host</dt>
        <dd>{formatValue(data.electrumHost)}:{formatValue(data.electrumPort)}</dd>
        <dt>Version</dt>
        <dd>{formatValue(data.electrumVersion)}</dd>
        <dt>Block height</dt>
        <dd>{formatValue(data.electrumBlockHeight && data.electrumBlockHeight.toLocaleString())}</dd>
        <dt>Indexed</dt>
        <dd>
        {formatValue(data.electrumBlockHeight && data.blocks && decimalFloor(data.electrumBlockHeight / data.blocks * 100, 10))} %
        </dd>
    </dl>
    </div>
)
};
