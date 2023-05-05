import { Stack, Typography } from "@mui/material";
import { WalletApi } from "@concordium/browser-wallet-api-helpers";
import { ConcordiumGRPCClient, ContractAddress } from "@concordium/web-sdk";

import Cis2Init from "./Cis2Init";
import Cis2FindInstance from "./Cis2FindInstance";
import { Cis2ContractInfo } from '../models/ConcordiumContractClient';

function Cis2FindInstanceOrInit(props: {
	grpcClient: ConcordiumGRPCClient;
	provider: WalletApi;
	account: string;
	contractInfo: Cis2ContractInfo;
	address?: ContractAddress; 
	onDone: (address: ContractAddress) => void;
}) {
	return (
		<Stack spacing={2}>
			<Cis2FindInstance
				grpcClient={props.grpcClient}
				contractInfo={props.contractInfo}
				address={props.address}
				onDone={props.onDone}
			/>
			<Typography variant="overline">Or</Typography>
			<Cis2Init {...props} />
		</Stack>
	);
}

export default Cis2FindInstanceOrInit;
