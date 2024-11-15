import { Dispatch, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as constants from '../constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/Alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ChangeItem {
    block_time: string;
    transaction_hash: string;
    new_status: string;
    additional_data: { bytes: number[] };
    event_index: number;
    item_id: number;
}

interface CreateItem {
    block_time: string;
    transaction_hash: string;
    event_index: number;
    initial_status: string;
}

/**
 * This function gets the historical ItemStatusChangedEvents for a given itemID.
 *
 * @param itemID - The itemID.
 * @throws If the server responds with an error or the response of the server is malformed.
 * @returns A json object including a vector of historical ItemStatusChangedEvents.
 */
async function getItemStatusChangedEvents(itemID: number, setItemChanged: Dispatch<ChangeItem[]>) {
    const response = await fetch(`api/getItemStatusChangedEvents`, {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
            item_id: itemID,
            limit: 30,
            offset: 0,
        }),
    });

    if (!response.ok) {
        const error = (await response.json()) as Error;
        throw new Error(`Unable to get item's change status events: ${JSON.stringify(error)}`);
    }
    const dataItemChanged = await response.json();
    if (dataItemChanged) {
        setItemChanged(dataItemChanged.data);
    } else {
        throw new Error(`Unable to get item's change status events`);
    }
}

/**
 * This function gets the historical ItemCreatedEvent for a given itemID.
 *
 * @param itemID - The itemID.
 * @throws If the server responds with an error or the response of the server is malformed.
 * @returns A json object including an option of the historical ItemCreateEvent.
 */
async function getItemCreatedEvent(itemID: number, setItemCreated: Dispatch<CreateItem>) {
    const response = await fetch(`api/getItemCreatedEvent`, {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(itemID),
    });

    if (!response.ok) {
        const error = (await response.json()) as Error;
        throw new Error(`Unable to get item's create event: ${JSON.stringify(error)}`);
    }
    const dataItemCreated = await response.json();
    if (dataItemCreated) {
        if (dataItemCreated.data) {
            setItemCreated(dataItemCreated.data);
        } else {
            throw new Error(`Item not found in database.`);
        }
    } else {
        throw new Error(`Unable to get item's create event`);
    }
}

export function Explorer() {
    interface FormType {
        itemID: string;
    }
    const form = useForm<FormType>({ mode: 'all', defaultValues: { itemID: '' } });

    const [itemChanged, setItemChanged] = useState<ChangeItem[] | undefined>(undefined);
    const [itemCreated, setItemCreated] = useState<CreateItem | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    async function onSubmit(values: FormType) {
        setError(undefined);
        setItemChanged(undefined);
        setItemCreated(undefined);

        if (values.itemID === '') {
            setError(`'itemID' input field is undefined`);
            throw Error(`'itemID' input field is undefined`);
        }
        console.log(values);
        // try {
        //     await getItemCreatedEvent(Number(values.itemID), setItemCreated);
        //     await getItemStatusChangedEvents(Number(values.itemID), setItemChanged);
        // } catch (error) {
        //     setError(`Couldn't get data from database. Orginal error: ${(error as Error).message}`);
        // }
    }

    return (
        <div className="h-full w-full flex flex-col items-center pt-32">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>Track The Journey Of Your Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="itemID"
                                rules={{ required: 'Item ID is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter the tracking number ID"
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
            <div className="fixed bottom-4">{error && <Alert destructive title="Error" description={error} />}</div>
            {itemChanged !== undefined && itemCreated !== undefined && (
                <>
                    <br />
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Timestamp</TableHead>
                                <TableHead>Transaction Hash</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">
                                    {new Date(itemCreated.block_time).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <a
                                        className="link"
                                        target="_blank"
                                        rel="noreferrer"
                                        href={`${constants.CCD_SCAN_URL}/?dcount=1&dentity=transaction&dhash=${itemCreated.transaction_hash}`}
                                    >
                                        {itemCreated.transaction_hash.slice(0, 5)}...
                                        {itemCreated.transaction_hash.slice(-5)}
                                    </a>
                                </TableCell>
                                <TableCell>{itemCreated.initial_status}</TableCell>
                            </TableRow>

                            {itemChanged.map((event, parentIndex) => (
                                <TableRow key={parentIndex}>
                                    <TableCell className="font-medium">
                                        {new Date(event.block_time).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            className="link"
                                            target="_blank"
                                            rel="noreferrer"
                                            href={`${constants.CCD_SCAN_URL}/?dcount=1&dentity=transaction&dhash=${event.transaction_hash}`}
                                        >
                                            {event.transaction_hash.slice(0, 5)}...
                                            {event.transaction_hash.slice(-5)}
                                        </a>
                                    </TableCell>
                                    <TableCell>{event.new_status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            )}
        </div>
    );
}
