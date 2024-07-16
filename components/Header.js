import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useRouter } from 'next/router';


export default () => {
    const router = useRouter();
    return (
        <Menu style={{ marginTop: '10px' }}>
            <Menu.Item onClick={() => router.push('/')}>
                CrowdCoin
            </Menu.Item>

            <Menu.Menu position='right'>
                <Menu.Item onClick={() => router.push('/')}>
                    Campaigns
                </Menu.Item>
                <Menu.Item onClick={() => router.push("/campaigns/new")}>
                    +
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}