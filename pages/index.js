import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'


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
    <>
      <h3>Open campaigns</h3>
      <div>{renderCampaigns()}
        <Button
          content="Create Campaign"
          icon='add circle'
          primary
        />
      </div>
    </>
  )
}

CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    campaigns
  }
}

export default CampaignIndex;



