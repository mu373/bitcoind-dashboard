import { NextApiRequest, NextApiResponse } from 'next';
import {
  getElectrumHostInfo,
  getElectrumVersion,
  getElectrumBlockHeight,
  getBitcoindHostInfo,
  getBlockInfo,
  getConnectionCount,
  getNetworkInfo,
  getMiningInfo,
  getMempoolInfo,
  getCurrentBlock,
  getCurrentChainSize,
} from '../../lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req.query;

  switch (method) {
    case 'getElectrumHostInfo':
      const electrumHostInfo = await getElectrumHostInfo();
      res.status(200).json(electrumHostInfo);
      break;
    case 'getElectrumVersion':
      const electrumVersion = await getElectrumVersion();
      res.status(200).json({ version: electrumVersion });
      break;
    case 'getElectrumBlockHeight':
      const electrumBlockHeight = await getElectrumBlockHeight();
      res.status(200).json({ height: electrumBlockHeight });
      break;
    case 'getBitcoindHostInfo':
      const bitcoindHostInfo = await getBitcoindHostInfo();
      res.status(200).json(bitcoindHostInfo);
      break;
    case 'getBlockInfo':
      const blockInfo = await getBlockInfo();
      res.status(200).json(blockInfo);
      break;
    case 'getConnectionCount':
      const connectionCount = await getConnectionCount();
      res.status(200).json({ count: connectionCount });
      break;
    case 'getNetworkInfo':
      const networkInfo = await getNetworkInfo();
      res.status(200).json(networkInfo);
      break;
    case 'getMiningInfo':
      const miningInfo = await getMiningInfo();
      res.status(200).json(miningInfo);
      break;
    case 'getMempoolInfo':
      const mempoolInfo = await getMempoolInfo();
      res.status(200).json(mempoolInfo);
      break;
    case 'getCurrentBlock':
      const currentBlock = await getCurrentBlock();
      res.status(200).json({ height: currentBlock });
      break;
    case 'getCurrentChainSize':
      const currentChainSize = await getCurrentChainSize();
      res.status(200).json(currentChainSize);
      break;
    default:
      res.status(400).json({ error: 'Invalid method' });
  }
}