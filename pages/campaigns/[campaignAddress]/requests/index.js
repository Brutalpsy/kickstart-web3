import Layout from '../../../../components/Layout';
import { Button } from 'semantic-ui-react';
import { useRouter } from 'next/router';
const RequestIndex = ({ campaignAddress }) => {
    const router = useRouter();

    return (
        <Layout>
            <h3> Requests</h3>

            <Button onClick={() => router.push(`/campaigns/${campaignAddress}/requests/new`)} color='teal' size='large'>
                Add Request
            </Button>
        </Layout>
    )
}

RequestIndex.getInitialProps = async ({ query: { campaignAddress } }) => {

    return { campaignAddress };
};

export default RequestIndex;