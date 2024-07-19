import React, { useState } from 'react';
import { Form, Button, Message, Icon, Input } from 'semantic-ui-react';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import { INITIAL_TRANSACTION_STATE } from '../../../../helpers/constants';
import useTransactionState from '../../../../hooks/useTransactionState';

const NewRequest = ({ campaignAddress }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    value: '',
    description: '',
    recipientAddress: '',
  });

  (async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
  })();

  const [{ loading, error, success }, setNewTransactionState] =
    useTransactionState(INITIAL_TRANSACTION_STATE);

  const updateFormData = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(campaignAddress);
    const { value, description, recipientAddress } = formData;

    setNewTransactionState({
      loading: 'Create request transaction is processing....',
    });

    try {
      const accounts = await web3.eth.getAccounts();
      const response = await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(value, 'ether'),
          recipientAddress
        )
        .send({
          from: accounts[0],
        });

      const etherscanLink = `https://sepolia.etherscan.io/tx/${response.transactionHash}`;

      setNewTransactionState({
        success: (
          <div>
            <Button
              size='large'
              color='teal'
              onClick={router.push(`/campaigns/${campaignAddress}/requests`)}
            >
              View all requests
            </Button>

            <Button basic size='large' color='blue'>
              <a href={etherscanLink} target='_blank'>
                View the transaction on Etherscan
              </a>
            </Button>
          </div>
        ),
      });
    } catch (err) {
      setNewTransactionState({
        error: err.message,
      });
    }
  };

  const renderMessage = () => {
    return (
      <Message
        visible
        icon
        negative={Boolean(error)}
        success={Boolean(success)}
        style={{ overflowWrap: 'break-word' }}
      >
        <Icon
          name={
            loading ? 'circle notched' : error ? 'times circle' : 'check circle'
          }
          loading={Boolean(loading)}
        />
        <Message.Content>
          {Boolean(success) && (
            <Message.Header>Request Created Successfully!</Message.Header>
          )}
          {loading ? loading : error ? error : success}
        </Message.Content>
      </Message>
    );
  };

  return (
    <Layout>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Description</label>
          <Input
            name='description'
            value={formData.description}
            onChange={updateFormData}
          />
        </Form.Field>

        <Form.Field>
          <label>Value in Ether</label>
          <Input
            name='value'
            label='ether'
            labelPosition='right'
            type='number' // enforce number only content
            step='any' //allow decimals
            min='0' //enforce positive numbers only
            value={formData.value}
            onChange={updateFormData}
          />
        </Form.Field>

        <Form.Field>
          <label>Recipient Adress</label>
          <Input
            name='recipientAddress'
            value={formData.recipientAddress}
            onChange={updateFormData}
          />
          <Button color='teal' size='large'>
            Create!
          </Button>
        </Form.Field>
      </Form>
      {Boolean(loading || error || success) && renderMessage()}
    </Layout>
  );
};

NewRequest.getInitialProps = ({ query: { campaignAddress } }) => {
  return { campaignAddress };
};

export default NewRequest;
