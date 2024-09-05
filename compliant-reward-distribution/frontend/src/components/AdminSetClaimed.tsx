import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Alert, Button, Form } from 'react-bootstrap';

import { validateAccountAddress } from '../utils';

interface Props {
    signer: string | undefined;
}

export function AdminSetClaimed(props: Props) {
    const { signer } = props;

    interface FormType {
        address: string | undefined;
    }
    const { control, register, formState, handleSubmit } = useForm<FormType>({ mode: 'all' });

    const [address] = useWatch({
        control: control,
        name: ['address'],
    });

    const [error, setError] = useState<string | undefined>(undefined);

    function onSubmit() {
        setError(undefined);

        if (!address) {
            setError(`'address' input field is undefined`);
            throw Error(`'address' input field is undefined`);
        }

        if (!signer) {
            setError(`'signer' is undefined. Connect your wallet.`);
            throw Error(`'signer' is undefined. Connect your wallet.`);
        }
    }

    return (
        <div className="centered">
            <div className="card">
                <h2 className="centered">Set Claimed</h2>
                <br />
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="col mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            {...register('address', { required: true, validate: validateAccountAddress })}
                            placeholder="4bbdAUCDK2D6cUvUeprGr4FaSaHXKuYmYVjyCa4bXSCu3NUXzA"
                        />
                        {formState.errors.address && (
                            <Alert variant="info">Address is required. {formState.errors.address.message}</Alert>
                        )}
                        <Form.Text />
                    </Form.Group>
                    <Button variant="secondary" type="submit">
                        Set Claimed
                    </Button>
                </Form>

                {error && <Alert variant="danger">{error}</Alert>}
            </div>
        </div>
    );
}
