import { Table, Button, Message, Icon } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import useTransactionState from '../hooks/useTransactionState';
import { useRouter } from 'next/router';

const RequestRow = ({ request, id, campaignAddress, approversCount }) => {
  const router = useRouter();

  const { Row, Cell } = Table;
  const [{ loading, error, success }, setNewTransactionState] =
    useTransactionState();

  const readyToFinalize = request.approvalCount > approversCount / 2;

  const renderMessage = () => {
    return (
      <Message
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
            <Message.Header>Request Successful!</Message.Header>
          )}
          {loading ? loading : error ? error : success}
        </Message.Content>
      </Message>
    );
  };

  // move func's to parent
  // move the 2 actions into one function really with state for approve or finalise
  const onApprove = async () => {
    const campaign = Campaign(campaignAddress);

    setNewTransactionState({
      loading: 'Approval is processing....',
    });

    try {
      const accounts = await web3.eth.getAccounts();
      const response = await campaign.methods
        .approveRequest(parseInt(id))
        .send({
          from: accounts[0],
        });

      setNewTransactionState({
        success: (
          <a
            href={`https://sepolia.etherscan.io/tx/${response.transactionHash}`}
            target='_blank'
          >
            View the transaction on Etherscan
          </a>
        ),
      });
      router.replace(`/campaigns/${campaignAddress}/requests`); //this will refresh the campaign stats on the page
    } catch (err) {
      setNewTransactionState({
        error: err.message,
      });
    }
  };

  const onFinalize = async () => {
    const campaign = Campaign(campaignAddress);

    setNewTransactionState({
      loading: 'Finalize is processing....',
    });

    try {
      const accounts = await web3.eth.getAccounts();
      const response = await campaign.methods
        .finalizeRequest(parseInt(id))
        .send({
          from: accounts[0],
        });

      setNewTransactionState({
        success: (
          <a
            href={`https://sepolia.etherscan.io/tx/${response.transactionHash}`}
            target='_blank'
          >
            View the transaction on Etherscan
          </a>
        ),
      });
      router.replace(`/campaigns/${campaignAddress}/requests`); //this will refresh the campaign stats on the page
    } catch (err) {
      setNewTransactionState({
        error: err.message,
      });
    }
  };

  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(parseInt(request.value), 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {parseInt(request.approvalCount)}/{approversCount}
      </Cell>

      <Cell>
        {request.complete ? null : (
          <Button disabled={loading} color='green' basic onClick={onApprove}>
            {' '}
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color='teal' disabled={loading} basic onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Cell>
      <Cell>{Boolean(loading || error || success) && renderMessage()}</Cell>
    </Row>
  );
};

export default RequestRow;
