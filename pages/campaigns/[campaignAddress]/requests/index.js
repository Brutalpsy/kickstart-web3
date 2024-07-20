import Layout from '../../../../components/Layout';
import { Button } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Campaign from '../../../../ethereum/campaign';
import { Table } from 'semantic-ui-react';
import RequestRow from '../../../../components/RequestRow';

const RequestIndex = ({
  campaignAddress,
  requests,
  requestCount,
  approversCount,
}) => {
  const router = useRouter();
  const { Header, Row, HeaderCell, Body } = Table;

  return (
    <Layout>
      <h3> Pending Requests</h3>
      <Button
        onClick={() =>
          router.push(`/campaigns/${campaignAddress}/requests/new`)
        }
        floated='right'
        style={{ marginBottom: 10 }}
        color='teal'
        size='large'
      >
        Add Request
      </Button>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          {requests.map((request, index) => (
            <RequestRow
              request={request}
              key={index}
              id={index}
              approversCount={approversCount}
              campaignAddress={campaignAddress}
            />
          ))}
        </Body>
      </Table>
      <div>Found {requestCount} requests.</div>
    </Layout>
  );
};

RequestIndex.getInitialProps = async ({ query: { campaignAddress } }) => {
  const campaign = Campaign(campaignAddress);
  const requestCount = parseInt(
    await campaign.methods.getRequestCount().call()
  );
  const approversCount = parseInt(
    await campaign.methods.approversCount().call()
  );

  const requests = await Promise.all(
    Array(requestCount)
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  console.log(requests);

  return { campaignAddress, requests, requestCount, approversCount };
};

export default RequestIndex;
