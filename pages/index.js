import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react'

import Layout from '../components/Layout';


const CampaignIndex = ({ campaigns }) => {

  const renderCampaigns = () => {
    const items = campaigns.map(address => ({
      header: address,
      description: <a> View Campaign </a>,
      fluid: true
    }))
    return <Card.Group items={items} />
  }

  return (
    <Layout>
      <div>
        <h3>Open campaigns</h3>
        <Button
          content="Create Campaign"
          icon='add circle'
          floated='right'
          primary
        />
        <div>{renderCampaigns()}

        </div>
      </div>
    </Layout>
  )
}

CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    campaigns
  }
}

export default CampaignIndex;



