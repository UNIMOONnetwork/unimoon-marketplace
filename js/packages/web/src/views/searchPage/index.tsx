import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Col, Layout, Row, Tabs } from 'antd';
import BN from 'bn.js';
// import { useMutation } from 'react-query';

import {
  AuctionView,
  AuctionViewState,
  useAuctions,
  // useCollections,
  // collectionQueryType,
} from '../../hooks';
import { useMeta } from '../../contexts';
// import profileService, { Profile } from '../../services/profile';

// import Header from '../../components/Header';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import { PlaceholderAssetCard } from '../../components/PlaceholderAssetCard';

const { TabPane } = Tabs;
const { Content } = Layout;

export enum SearchPageState {
  Auctions = '0',
  Collections = '1',
  Users = '2',
}

export const AuctionsView = (props: {
  isLoading: boolean;
  auctions: AuctionView[];
}) => {
  const { isLoading, auctions } = props;
  return (
    <>
      {!isLoading ? (
        auctions && auctions.length ? (
          auctions.slice(0, 12).map((m: any, idx: any) => {
            const id = m.auction.pubkey.toString();
            return (
              <Link to={`/bid/${id}`} key={idx}>
                <AuctionRenderCard key={id} auctionView={m} />
              </Link>
            );
          })
        ) : (
          <PlaceholderAssetCard />
        )
      ) : ""
      }
    </>
  );
};

export const SearchPage = () => {
  const url = window.location.href;
  const regex = new RegExp('[?&]q(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  const searchTerms = results && results.length > 0 ? results[2] : '';

  const [activeKey, setActiveKey] = useState(SearchPageState.Auctions);
  const { connected, publicKey } = useWallet();

  const { isLoading, store } = useMeta();
  const [value, setValue] = useState(0);
  // const [profiles, setProfiles] = useState<Profile[]>([]);

  const auctionsLive = useAuctions(AuctionViewState.Live);
  const auctionsEnded = useAuctions(AuctionViewState.Ended);

  const liveAuctions = auctionsLive.sort(
    (a, b) =>
      a.auction.info.endedAt
        ?.sub(b.auction.info.endedAt || new BN(0))
        .toNumber() || 0,
  );

  const searchAuctions = liveAuctions
    .concat(auctionsEnded)
    .filter(item =>
      item.thumbnail.metadata.info.data.name
        .toLowerCase()
        .includes(searchTerms.toLowerCase()),
    )
    .sort((a, b) =>
      (b.auction.info.priceFloor.minPrice! || new BN(0))
        .sub(a.auction.info.priceFloor.minPrice || new BN(0))
        .toNumber(),
    );

  // const { collections } = useCollections();

  // const searchCollections = collections.filter(item =>
  //   item.name.toLowerCase().includes(searchTerms.toLowerCase()),
  // );

  return (
    <div className="search-page">
      <div className="title-text valign-text-middle mulish-bold-black-32px">
        Search results{searchTerms != '' && ' for ' + searchTerms}
      </div>

      <Layout>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 10 }}>
            <Row>
              <Tabs
                activeKey={activeKey}
                onTabClick={key => setActiveKey(key as SearchPageState)}
              >
                <TabPane
                  tab={
                    <span className="tab-title">Auctions</span>
                  }
                  className="tab-pane"
                  key={SearchPageState.Auctions}
                >
                  <AuctionsView isLoading={isLoading} auctions={searchAuctions} />
                </TabPane>
                <TabPane
                  tab={<span className="tab-title">Collections</span>}
                  key={SearchPageState.Collections}
                >
                  
                </TabPane>
                {connected && (
                  <TabPane
                    tab={<span className="tab-title">Users</span>}
                    key={SearchPageState.Users}
                  >
                    
                  </TabPane>
                )}
              </Tabs>
            </Row>
          </Col>
        </Content>
      </Layout>
    </div>
  );
};
