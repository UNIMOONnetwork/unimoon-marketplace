import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'react-router-dom';
import { Col, Layout, Row, Tabs } from 'antd';
import Masonry from 'react-masonry-css';
import { AuctionView } from '../../hooks';
import { useMeta } from '../../contexts';
import { ArtContent } from '../../components/ArtContent';
import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import { PlaceholderAssetCard } from '../../components/PlaceholderAssetCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Profile } from '../../services/profile/profile.types';
import { CardLoader } from '../../components/MyLoader';
import { ProfileDetailPage } from './details';

const { TabPane } = Tabs;

const { Content } = Layout;

interface InventoryProps {
  owned: any[];
  profile?: Profile;
  nfts: any[];
  auctions: AuctionView[];
}

export enum ProfileTabState {
  Profile = '0',
  Owned = '1',
  Created = '2',
  Auctions = '3',
}

export const Inventory = ({
  owned,
  profile,
  nfts,
  auctions,
}: InventoryProps) => {
  const wallet = useWallet();
  const [activeKey, setActiveKey] = useState(ProfileTabState.Profile);
  const userId = wallet?.publicKey?.toString();

  const { isLoading } = useMeta();

  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const createdItemsView = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      }}
    >
      {nfts.map((nItem, index) => (
        // <Card className="art-card" key={index}>
        <Link to={`/nft/${nItem.pubkey}`}>
          <ArtContent
            className="auction-image no-events"
            preview={false}
            pubkey={nItem.pubkey}
            allowMeshRender={false}
          />
          <div className="inventory-card">{nItem.info.data.name}</div>
        </Link>
        //</Card>
      ))}
    </div>
  );

  const ownedItemsView = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      }}
    >
      {owned.map(({ metadata }, index) => (
        // <Card className="art-card" key={index}>
        <Link to={`/nft/${metadata.pubkey}`}>
          <ArtContent
            className="auction-image no-events"
            preview={false}
            pubkey={metadata.pubkey}
            allowMeshRender={false}
          />
          <div className="inventory-card">{metadata.info.data.name}</div>
        </Link>
        // </Card>
      ))}
    </div>
  );

  const auctionsView = (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {!isLoading
        ? auctions.map((m, idx) => {
            const id = m.auction.pubkey;
            return (
              <Link to={`/auction/${id}`} key={idx}>
                <AuctionRenderCard key={id} auctionView={m} />
              </Link>
            );
          })
        : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
    </Masonry>
  );

  return (
    <Layout>
      <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Col style={{ width: '100%', marginTop: 10 }}>
          <Row>
            <Tabs
              activeKey={activeKey}
              onTabClick={key => setActiveKey(key as ProfileTabState)}
            >
              {profile && (
                <TabPane
                  tab={<span className="tab-title">Profile</span>}
                  key={ProfileTabState.Profile}
                >
                  <ProfileDetailPage profile={profile} />
                </TabPane>
              )}

              {profile && profile.ownerId == userId && (
                <TabPane
                  tab={<span className="tab-title">Owned</span>}
                  key={ProfileTabState.Owned}
                >
                  {ownedItemsView}
                </TabPane>
              )}
              <TabPane
                tab={<span className="tab-title">Created</span>}
                key={ProfileTabState.Created}
              >
                {createdItemsView}
              </TabPane>
              <TabPane
                tab={<span className="tab-title">Auctions</span>}
                key={ProfileTabState.Auctions}
              >
                {auctionsView}
              </TabPane>
            </Tabs>
          </Row>
        </Col>
      </Content>
    </Layout>
  );
};
