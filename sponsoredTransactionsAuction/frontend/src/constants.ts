import { BrowserWalletConnector, ephemeralConnectorType } from '@concordium/react-components';
import { ContractName } from '@concordium/web-sdk';

import moment from 'moment';

export const VERIFIER_URL = '/api';

export const NODE = 'https://grpc.testnet.concordium.com';

export const PORT = 20000;

export const REFRESH_INTERVAL = moment.duration(2, 'seconds');

export const SPONSORED_TX_CONTRACT_NAME = ContractName.fromString('cis2_multi');
export const AUCTION_CONTRACT_NAME = ContractName.fromString('sponsored_tx_enabled_auction');

export const CONTRACT_SUB_INDEX = 0n;

// Before submitting a transaction we simulate/dry-run the transaction to get an
// estimate of the energy needed for executing the transaction. In addition, we
// allow an additional small amount of energy `EPSILON_ENERGY` to be consumed by
// the transaction to cover small variations (e.g. changes to the smart contract
// state) caused by transactions that have been executed meanwhile.
export const EPSILON_ENERGY = 200n;

export const AUCTION_START = '2000-01-01T12:00:00Z'; // Hardcoded value for simplicity for this demo dApp.
export const AUCTION_END = '2050-01-01T12:00:00Z'; // Hardcoded value for simplicity for this demo dApp.

export const METADATA_URL =
    'https://gist.githubusercontent.com/DOBEN/e035ef44705cdf8919f72c98a25d54eb/raw/8c6b375a2dff448e7bbd12a27fc420d41f268f12/gistfile1.txt'; // We use the same metadat URL for every token_id for simplicity for this demo dApp. In production, you should consider using a different metadata file for each token_id.

export const TRANSFER_SCHEMA =
    'EAEUAAUAAAAIAAAAdG9rZW5faWQdAAYAAABhbW91bnQbJQAAAAQAAABmcm9tFQIAAAAHAAAAQWNjb3VudAEBAAAACwgAAABDb250cmFjdAEBAAAADAIAAAB0bxUCAAAABwAAAEFjY291bnQBAQAAAAsIAAAAQ29udHJhY3QBAgAAAAwWAQQAAABkYXRhHQE=';

export const SERIALIZATION_HELPER_SCHEMA_ADDITIONAL_DATA = 'Aw==';

export const BROWSER_WALLET = ephemeralConnectorType(BrowserWalletConnector.create);
