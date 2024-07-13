// deploy code will go here
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');

const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'thought gossip dress home awesome ramp upon pepper truth chaos frozen laptop', //wallet mnemonic
  'https://sepolia.infura.io/v3/d7c20ee6a57d41cb950f55ec5baf6287' //test network endpoints
);
const web3 = new Web3(provider);

(async () => {
  const accounts = await web3.eth.getAccounts();

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({
      data: compiledFactory.bytecode,
    })
    .send({ from: accounts[0], gas: '1000000' });

  console.log('contract deployed to: ', result.options.address);

  //prevents hanging deployment
  provider.engine.stop();
})();
