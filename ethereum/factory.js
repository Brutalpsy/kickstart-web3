import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';


const contractAddress = '0x3a5b32B256DFbC0E4a24B0E6E9A9316a9660Cc6B'

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    contractAddress
);

export default instance;