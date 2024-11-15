import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { WalletConnection } from '@concordium/wallet-connectors';
import {
    AccountAddress,
    TransactionHash,
    TransactionKindString,
    TransactionSummaryType,
    UpdatedEvent,
} from '@concordium/web-sdk';
import { useGrpcClient } from '@concordium/react-components';

import * as constants from '../constants';
import { TxHashLink } from '../components/CCDScanLinks';
import { createItem } from '../track_and_trace_contract';
import * as TrackAndTraceContract from '../../generated/module_track_and_trace';
import { FromTokenIdU64 } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/Alert';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
interface Props {
    connection: WalletConnection | undefined;
    accountAddress: string | undefined;
    activeConnectorError: string | undefined;
}

interface PartialItemCreatedEvent {
    item_id: string;
}

export function AdminCreateItem(props: Props) {
    const { connection, accountAddress, activeConnectorError } = props;

    interface FormType {
        url: string;
    }
    const form = useForm<FormType>({ mode: 'all', defaultValues: { url: ''} });

    const [txHash, setTxHash] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [newItemId, setNewItemId] = useState<number | bigint | undefined>(undefined);

    const grpcClient = useGrpcClient(constants.NETWORK);

    // Wait until the submitted transaction is finalized.
    // Once the transaction is finalized, extract the
    // newly created ItemIndex from the event emitted within the transaction.
    useEffect(() => {
        if (connection && grpcClient && txHash !== undefined) {
            grpcClient
                .waitForTransactionFinalization(TransactionHash.fromHexString(txHash))
                .then((report) => {
                    if (
                        report.summary.type === TransactionSummaryType.AccountTransaction &&
                        report.summary.transactionType === TransactionKindString.Update
                    ) {
                        const eventList = report.summary.events[0] as UpdatedEvent;

                        const parsedEvent = TrackAndTraceContract.parseEvent(eventList.events[0]);
                        const itemCreatedEvent = parsedEvent.content as unknown as PartialItemCreatedEvent;

                        // The `item_id` is of type `TokenIdU64` in the smart contract and logged in the event as
                        // a little-endian hex string.
                        // E.g. the `TokenIdU64` representation of `1` is the hex string `0100000000000000`.
                        // This function converts the `TokenIdU64` representation into a bigint type here.
                        const itemId: bigint = FromTokenIdU64(itemCreatedEvent.item_id);
                        setNewItemId(itemId);
                    } else {
                        setError('Tansaction failed and event decoding failed.');
                    }
                })
                .catch((e) => {
                    setNewItemId(undefined);
                    setError((e as Error).message);
                });
        }
    }, [connection, grpcClient, txHash]);

    function onSubmit(values: FormType) {
        setError(undefined);

        if (values.url === '') {
            setError(`'url' input field is undefined`);
            throw Error(`'url' input field is undefined`);
        }

        const parameter: TrackAndTraceContract.CreateItemParameter = {
            type: 'Some',
            content: {
                url: values.url,
                hash: { type: 'None' },
            },
        };

        // Send transaction
        if (accountAddress && connection) {
            createItem(connection, AccountAddress.fromBase58(accountAddress), parameter)
                .then((txHash) => {
                    setTxHash(txHash);
                })
                .catch((e) => {
                    setError((e as Error).message);
                });
        } else {
            setError(`Wallet is not connected. Click 'Connect Wallet' button.`);
        }
    }

    return (
        <div className="h-full w-full flex flex-col items-center pt-32">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="url"
                                rules={{ required: 'URL is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter the metadata URL" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="fixed bottom-4">
                {error && <Alert destructive title="Error" description={error} />}
                {activeConnectorError && (
                    <Alert
                        destructive
                        title="Connect Error"
                        description={
                            <>
                                <p>{activeConnectorError}</p>
                                <p>Refresh page if you have the browser wallet installed.</p>
                            </>
                        }
                    />
                )}
                {txHash && (
                    <Alert
                        title="Transaction Result"
                        description={
                            <>
                                <TxHashLink txHash={txHash} />
                                <p>You will see the item id below after the transaction is finalized.</p>
                            </>
                        }
                    />
                )}
                {newItemId !== undefined && <Alert title="New Item" description={`Item ID: ${newItemId.toString()}`} />}
            </div>
        </div>
    );
}
