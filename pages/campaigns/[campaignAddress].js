import Layout from '../../components/Layout';

const campaignsShow = ({ campaignAddress }) => {

    return (<Layout>{campaignAddress}</Layout>)
}


campaignsShow.getInitialProps = (props) => {
    return {
        campaignAddress: props.query.campaignAddress
    }
};

export default campaignsShow;