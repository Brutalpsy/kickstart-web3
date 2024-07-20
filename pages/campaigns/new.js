import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message, Icon } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { useRouter } from 'next/router';
import useTransactionState from '../../hooks/useTransactionState';
import INITIAL_TRANSACTION_STATE from '../../helpers/constants';

const CampaignNew = (props) => {
  const router = useRouter();

  const [minimumContribution, setMinimumContribution] = useState('');
  const [{ loading, error, success }, setNewTransactionState] =
    useTransactionState(INITIAL_TRANSACTION_STATE);

  const onSubmit = async (event) => {
    event.preventDefault();

    setNewTransactionState({
      loading: 'Transaction is processing....',
    });

    try {
      const accounts = await web3.eth.getAccounts();
      const response = await factory.methods
        .createCampaign(minimumContribution)
        .send({
          from: accounts[0],
        });
      const etherscanLink = `https://sepolia.etherscan.io/tx/${response.transactionHash}`;
      setNewTransactionState({
        success: (
          <a href={etherscanLink} target='_blank'>
            View the transaction on Etherscan
          </a>
        ),
      });
      router.push('/');
    } catch (err) {
      console.log(err.message);
      setNewTransactionState({
        error: err.message,
      });
      setMinimumContribution('');
    }
  };

  const renderMessage = () => {
    return (
      <Message icon visible negative={Boolean(error)}>
        <Icon
          name={
            loading ? 'circle notched' : error ? 'times circle' : 'check circle'
          }
          loading={Boolean(loading)}
        />
        <Message.Content>
          {Boolean(success) && (
            <Message.Header>Transaction Success!</Message.Header>
          )}
          {loading ? loading : error ? error : success}
        </Message.Content>
      </Message>
    );
  };

  return (
    <Layout>
      <h3>Create a campaign</h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            focus
            type='number' // enforce number only content
            min='0' //enforce positive numbers only
            disabled={Boolean(loading)} //disable input if loading
            label='wei'
            labelPosition='right'
            value={minimumContribution}
            onChange={(event) => setMinimumContribution(event.target.value)}
          />
        </Form.Field>
        <Button color='teal' size='large' loading={!!loading}>
          Create
        </Button>
        {Boolean(loading || error || success) && renderMessage()}
      </Form>
    </Layout>
  );
};

export default CampaignNew;
