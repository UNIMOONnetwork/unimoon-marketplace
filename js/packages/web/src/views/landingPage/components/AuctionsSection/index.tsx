import React, { useEffect, useMemo } from 'react';
import { Col, Row, Layout, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useAuctions, AuctionView, AuctionViewState } from '../../../../hooks';
import { useMeta } from '../../../../contexts';
import { CardLoader } from '../../../../components/MyLoader';
import { AuctionRenderCard2 } from '../../../../components/AuctionRenderCard';

const { Content } = Layout;

export const AuctionsSection = () => {
  const { auctionViews: auctions } = useAuctions();
  const { isLoading } = useMeta();

  const checkPrimarySale = (auction: AuctionView): boolean =>
    auction.thumbnail.metadata.info.primarySaleHappened;

  const liveAuctionsFilter = (auction: AuctionView): boolean =>
    auction.state === AuctionViewState.Live && !checkPrimarySale(auction);

  const filteredAuctions = useMemo(() => {
    return auctions.filter(auction => liveAuctionsFilter(auction));
  }, [auctions]);

  return (
    <div id="auctions-section">
      <Layout style={{ margin: 0, marginTop: 30 }}>
        <Row className="section-title-row">
          <div className="section-title">Limited Auctions</div>
          <Link to={`/home`}>
            <Button className="unimoon-button transparent-button">
              Explore More
            </Button>
          </Link>
        </Row>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 10 }}>
            <Row>
              <div className="artwork-grid">
                {isLoading &&
                  [...Array(4)].map((_, idx) => <CardLoader key={idx} />)}
                {!isLoading &&
                  filteredAuctions.slice(0, 4).map(auction => (
                    <Link
                      key={auction.auction.pubkey}
                      to={`/auction/${auction.auction.pubkey}`}
                    >
                      <AuctionRenderCard2 auctionView={auction} />
                    </Link>
                  ))}
              </div>
            </Row>
          </Col>
        </Content>
      </Layout>
    </div>
  );
};
