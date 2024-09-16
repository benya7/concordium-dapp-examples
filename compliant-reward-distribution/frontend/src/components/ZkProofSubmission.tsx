import { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import sha256 from 'sha256';
import { Buffer } from 'buffer';

import {
    AccountAddress,
    ConcordiumGRPCClient,
    CredentialDeploymentValues,
    CredentialStatement,
} from '@concordium/web-sdk';

import { WalletProvider } from '../wallet-connection';
import { getRecentBlock } from '../utils';
import { CONTEXT_STRING } from '../constants';
import { getStatement, submitZkProof } from '../apiReqeuests';

interface Props {
    prover: string | undefined;
    grpcClient: ConcordiumGRPCClient | undefined;
    provider: WalletProvider | undefined;
}

export function ZkProofSubmission(props: Props) {
    const { prover, provider, grpcClient } = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [successfulSubmission, setSuccessfulSubmission] = useState<boolean | undefined>(undefined);
    const [zkStatement, setZkStatement] = useState<CredentialStatement | undefined>(undefined);

    useEffect(() => {
        const fetchStatement = async () => {
            const statement: CredentialStatement = await getStatement();
            setZkStatement(statement);
        };

        fetchStatement();
    }, []);

    interface FormType {}
    const { handleSubmit } = useForm<FormType>({ mode: 'all' });

    async function onSubmit() {
        setError(undefined);
        setSuccessfulSubmission(undefined);

        try {
            if (!zkStatement) {
                throw Error(`'zkStatement' is undefined.`);
            }

            if (!provider || !prover) {
                throw Error(
                    `'provider' or 'prover' are undefined. Connect your wallet. Have an account in your wallet.`,
                );
            }

            const { blockHash: recentBlockHash, blockHeight: recentBlockHeight } = await getRecentBlock(grpcClient);

            const digest = [recentBlockHash, Buffer.from(CONTEXT_STRING)];
            const challenge = sha256(digest.flatMap((item) => Array.from(item)));

            const accountInfoProver = await grpcClient?.getAccountInfo(AccountAddress.fromBase58(prover));
            const credIdConnectedAccount = (
                accountInfoProver?.accountCredentials[0].value.contents as CredentialDeploymentValues
            ).credId;

            const presentation = await provider.requestVerifiablePresentation(challenge, [zkStatement]);

            if (
                credIdConnectedAccount !==
                presentation.verifiableCredential[0].credentialSubject.id.replace(
                    /did:ccd:(mainnet|testnet):cred:/g,
                    '',
                )
            ) {
                throw Error(
                    `When approving the ZK proof in the wallet, select your connected account from the drop-down menu in the wallet (expect proof for account: ${prover}).`,
                );
            }

            await submitZkProof(presentation, recentBlockHeight);

            setSuccessfulSubmission(true);
        } catch (error) {
            setError((error as Error).message);
        }
    }

    return (
        <div className="centered">
            <div className="card">
                <h2 className="centered"> Submit ZK Proof</h2>
                <br />
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <br />
                    <Button
                        variant="info"
                        id="accountAddress"
                        disabled={true}
                        hidden={successfulSubmission === undefined}
                    >
                        Success
                    </Button>
                </Form>
            </div>
        </div>
    );
}
