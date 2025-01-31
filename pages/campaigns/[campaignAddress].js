import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Button, Card, Grid } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { useRouter } from "next/router";

const CampaignShow = ({
    campaignAddress,
    minimumContribution,
    balance,
    requestCount,
    approversCount,
    manager,
}) => {
    const router = useRouter();
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
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Card.Group items={items}>
                        </Card.Group>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm campaignAddress={campaignAddress} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Button color='teal' size='large' onClick={() => router.push(`/campaigns/${campaignAddress}/requests`)}>
                            Show Requests
                        </Button>
                    </Grid.Column>

                </Grid.Row>
            </Grid>
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