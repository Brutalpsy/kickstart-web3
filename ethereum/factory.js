import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const contractAddress = '0x65b523CfB316eED875C76dbe485B7659A6902856'

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    contractAddress
);

export default instance;