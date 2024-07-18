import React, { Component, useState } from 'react';
import { Button, Form, Icon, Input, Message } from 'semantic-ui-react';
import Camapaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { INITIAL_TRANSACTION_STATE } from '../helpers/constants';
import { useRouter } from 'next/router';


const ContributeForm = ({ campaignAddress }) => {
    const router = useRouter();

    const [contribution, setContribution] = useState('');
    const [transactionState, setTransactionState] = useState(
        INITIAL_TRANSACTION_STATE
    );

    const renderMessage = () => {
        return (
            <Message visible icon success={!!success} negative={!!error}>
                <Icon
                    name={
                        loading ? "circle notched" : error ? "times circle" : "check circle"
                    }
                    loading={!!loading}
                />
                <Message.Content>
                    {Boolean(success) && (
                        <Message.Header>Transaction Success!</Message.Header>
                    )}
                    {loading ? loading : error ? error : success}
                </Message.Content>
            </Message>
        )
    }

    const { loading, error, success } = transactionState;

    const onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Camapaign(campaignAddress);

        setTransactionState({
            ...INITIAL_TRANSACTION_STATE,
            loading: 'Transaction is processing...'
        })

        try {
            const accounts = await web3.eth.getAccounts();
            const response = await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(contribution, "ether"),
            })

            const etherscanLink = `https://sepolia.etherscan.io/tx/${response.transactionHash}`;
            setTransactionState({
                ...INITIAL_TRANSACTION_STATE,
                success: (
                    <a href={etherscanLink} target="_blank">
                        View the transaction on Etherscan
                    </a>
                ),
            });

            setContribution('');
            router.replace(`/campaigns/${campaignAddress}`); // this will refresh the campaign stats on the page
        } catch (err) {
            setTransactionState({
                ...INITIAL_TRANSACTION_STATE,
                error: err.message
            })
        }

    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input
                    label='ether'
                    value={contribution}
                    placeholder={`Amount to contribute to campaign: ${campaignAddress}`}
                    focus
                    type='number'
                    step='any'
                    min="0" // enforse positive numbers only
                    disabled={!!loading} // disable input if loading
                    onChange={event => setContribution(event.target.value)}
                    labelPosition='right'
                />
            </Form.Field>
            <Button color='teal' disabled={!!loading} size='large'>
                Contribute!
            </Button>
            {Boolean(loading || error || success) && renderMessage()}
        </Form>
    )
}


export default ContributeForm;