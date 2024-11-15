import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { WalletConnection } from '@concordium/wallet-connectors';
import { AccountAddress } from '@concordium/web-sdk';

import { TxHashLink } from '@/components/CCDScanLinks';
import { addRole, removeRole } from '../track_and_trace_contract';
import * as TrackAndTraceContract from '../../generated/module_track_and_trace';
import { validateAccountAddress } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/Alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

interface Props {
    connection: WalletConnection | undefined;
    accountAddress: string | undefined;
    activeConnectorError: string | undefined;
}

export function AdminChangeRoles(props: Props) {
    const { connection, accountAddress, activeConnectorError } = props;

    interface FormType {
        address: string;
        addAdmin: boolean;
    }
    const form = useForm<FormType>({
        mode: 'all',
        defaultValues: {
            address: '',
            addAdmin: true,
        },
    });

    const [txHash, setTxHash] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    function onSubmit(values: FormType) {
        setError(undefined);

        if (values.address === '') {
            setError(`'address' input field is undefined`);
            throw Error(`'address' input field is undefined`);
        }

        const parameter: TrackAndTraceContract.RevokeRoleParameter = {
            address: { type: 'Account', content: AccountAddress.fromBase58(values.address) },
            role: { type: 'Admin' },
        };

        if (accountAddress && connection) {
            // Send transaction
            if (values.addAdmin) {
                addRole(connection, AccountAddress.fromBase58(accountAddress), parameter)
                    .then((txHash: string) => {
                        setTxHash(txHash);
                    })
                    .catch((e) => {
                        setError((e as Error).message);
                    });
            } else {
                removeRole(connection, AccountAddress.fromBase58(accountAddress), parameter)
                    .then((txHash: string) => {
                        setTxHash(txHash);
                    })
                    .catch((e) => {
                        setError((e as Error).message);
                    });
            }
        } else {
            setError(`Wallet is not connected. Click 'Connect Wallet' button.`);
        }
    }
    return (
        <div className="h-full w-full flex flex-col items-center pt-32">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>Change Admin Role of an Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="addAdmin"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="flex gap-2 items-center">
                                            <FormLabel>Add</FormLabel>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormLabel>Remove</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                rules={{ required: 'Address is required', validate: validateAccountAddress }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="4bbdAUCDK2D6cUvUeprGr4FaSaHXKuYmYVjyCa4bXSCu3NUXzA"
                                                {...field}
                                            />
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
                        description={<TxHashLink txHash={txHash} />}
                    />
                )}
            </div>
        </div>
    );
}
