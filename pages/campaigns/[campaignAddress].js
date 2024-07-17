import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';

const CampaignShow = ({
    campaignAddress,
    minimumContribution,
    balance,
    requestCount,
    approversCount,
    manager,
}) => {

    console.log(requestCount)
    const items = [
        {
            header: "Manager Address",
            meta: manager,
            description:
                "The manager created this campaign and can create requests to withdraw this money",
            style: { overflowWrap: "break-word" },
        },
        {
            header: "Minimum Contribution",
            meta: `${Number(minimumContribution)} wei`,
            description:
                "The minimum amount to contribute to this campaign in wei to become an approver",
            style: { overflowWrap: "break-word" },
        },
        {
            header: "Camapaign Balance",
            meta: `${balance} wei = ${web3.utils.fromWei(balance, "ether")} eth`,
            description: "How much money this campaign has left to spend",
            style: { overflowWrap: "break-word" },
        },
        {
            header: "Number of requests",
            meta: Number(requestCount),
            description:
                "A request tries to withdraw money from the account. Requests must be approved by a minimum 50% of approvers",
            style: { overflowWrap: "break-word" },
        },
        {
            header: "Number of Approvers",
            meta: Number(approversCount),
            description:
                "The number of approvers that have already contributed to this campaign",
            style: { overflowWrap: "break-word" },
        },
    ];

    return (
        <Layout>
            <Card.Group items={items}>
            </Card.Group>
        </Layout >)
}


CampaignShow.getInitialProps = async (props) => {
    const campaignDetails = Campaign(props.query.campaignAddress);
    const summary = await campaignDetails.methods.getSummary().call();
    return {
        campaignAddress: props.query.campaignAddress,
        minimumContribution: summary[0],
        balance: summary[1],
        requestCount: summary[2],
        approversCount: summary[3],
        manager: summary[4],
    };
};

export default CampaignShow;