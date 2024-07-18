import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react'
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from "next/link";

const CampaignIndex = ({ campaigns }) => {
  const router = useRouter();


  const items = campaigns.map((campaignAddress) => {
    return {
      header: campaignAddress,
      description: (
        <Link href={`/campaigns/${campaignAddress}`}>
          <a>View campaign</a>
        </Link>
      ),
      fluid: true,
    };
  });

  return (
    <Layout>
      <div>
        <h3>Open campaigns</h3>
        <Button
          content="Create Campaign"
          icon='add circle'
          floated='right'
          color='teal'
          size='large'
          onClick={() => router.push('campaigns/new')}
        />
        <Card.Group items={items} centered />
      </div>
    </Layout >
  )
}

CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    campaigns
  }
}

export default CampaignIndex;



