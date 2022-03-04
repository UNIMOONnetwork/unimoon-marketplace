import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Tabs, Dropdown, Menu } from 'antd';
import { useMeta } from '../../contexts';
import { CardLoader } from '../../components/MyLoader';
import { CollectionCard2 } from '../../components/CollectionCard';

import { ArtworkViewState } from './types';
import { useItems } from './hooks/useItems';
import { useCollections } from '../../hooks';
import ItemCard from './components/ItemCard';
import { useUserAccounts } from '@oyster/common';
import { DownOutlined } from '@ant-design/icons';
import { isMetadata, isPack } from './utils';

const { TabPane } = Tabs;
const { Content } = Layout;

export const ArtworksContentView = ({ userItems, isDataLoading }) => {
  return (
    <div className="artwork-grid">
      {isDataLoading &&
        [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
      {!isDataLoading &&
        userItems.map(item => {
          const pubkey = isMetadata(item)
            ? item.pubkey
            : isPack(item)
            ? item.provingProcessKey
            : item.edition?.pubkey || item.metadata.pubkey;

          return <ItemCard item={item} key={pubkey} />;
        })}
    </div>
  );
};

export const ArtworksView = () => {
  const wallet = useWallet();
  const { connected } = useWallet();

  const {
    isLoading,
    pullAllMetadata,
    storeIndexer,
    pullItemsPage,
    isFetching,
  } = useMeta();
  const { userAccounts } = useUserAccounts();

  const [activeKey, setActiveKey] = useState(ArtworkViewState.Metaplex);

  const userItems = useItems({ activeKey });
  const { collectionLoading, collections } = useCollections(
    wallet.publicKey?.toString(),
  );

  useEffect(() => {
    if (!isFetching) {
      pullItemsPage(userAccounts);
    }
  }, [isFetching]);

  useEffect(() => {
    if (connected) {
      setActiveKey(ArtworkViewState.Owned);
    } else {
      setActiveKey(ArtworkViewState.Metaplex);
    }
  }, [connected, setActiveKey]);

  const isDataLoading = isLoading || isFetching;

  const artworkGrid = (
    <ArtworksContentView userItems={userItems} isDataLoading={isDataLoading} />
  );

  const refreshButton = connected && storeIndexer.length !== 0 && (
    <Dropdown.Button
      className="refresh-button padding0"
      onClick={() => pullItemsPage(userAccounts)}
      icon={<DownOutlined />}
      overlayClassName="refresh-overlay"
      overlay={
        <Menu className="gray-dropdown">
          <Menu.Item onClick={() => pullAllMetadata()}>
            Load All Metadata
          </Menu.Item>
        </Menu>
      }
    >
      Refresh
    </Dropdown.Button>
  );

  return (
    <Layout style={{ margin: 0, marginTop: 30 }} className="artworks">
      <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Col style={{ width: '100%', marginTop: 10 }}>
          <Row>
            {connected && (
              <Tabs
                activeKey={activeKey}
                onTabClick={key => setActiveKey(key as ArtworkViewState)}
                tabBarExtraContent={refreshButton}
              >
                <TabPane
                  tab={<span className="tab-title">Collections</span>}
                  key={ArtworkViewState.Metaplex}
                >
                  <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Col style={{ width: '100%', marginTop: 10 }}>
                      <Row className="collection-group">
                        {collections &&
                          collections.length > 0 &&
                          collections.map((item, index) => (
                            <CollectionCard2 {...item} key={index} />
                          ))}
                      </Row>
                    </Col>
                  </Content>
                </TabPane>

                <TabPane
                  tab={<span className="tab-title">Owned</span>}
                  key={ArtworkViewState.Owned}
                >
                  {artworkGrid}
                </TabPane>

                <TabPane
                  tab={<span className="tab-title">Created</span>}
                  key={ArtworkViewState.Created}
                >
                  {artworkGrid}
                </TabPane>
              </Tabs>
            )}
          </Row>
        </Col>
      </Content>
    </Layout>
  );
};
