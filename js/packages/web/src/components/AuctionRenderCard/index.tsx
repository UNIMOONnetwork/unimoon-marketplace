import React from 'react';
import { Card, CardProps } from 'antd';
import { Typography, Button } from 'antd';

import { ArtContent } from '../ArtContent';
import { AuctionView, useArt, useCreators } from '../../hooks';
import { AmountLabel } from '../AmountLabel';
import { MetaAvatar } from '../MetaAvatar';
import { AuctionCountdown } from '../AuctionNumbers';

import { useAuctionStatus } from './hooks/useAuctionStatus';
import { useTokenList } from '../../contexts/tokenList';

export interface AuctionCard extends CardProps {
  auctionView: AuctionView;
}

const { Text, Title } = Typography;

export const AuctionRenderCard = (props: AuctionCard) => {
  const { auctionView } = props;
  const id = auctionView.thumbnail.metadata.pubkey;
  const art = useArt(id);
  const creators = useCreators(auctionView);
  const name = art?.title || ' ';

  const tokenInfo = useTokenList().mainnetTokens.filter(
    m => m.address == auctionView.auction.info.tokenMint,
  )[0];
  const { status, amount } = useAuctionStatus(auctionView);

  const card = (
    <Card hoverable={true} className={`auction-render-card`} bordered={false}>
      <div className={'card-art-info'}>
        <div className="auction-gray-wrapper">
          <div className={'card-artist-info'}>
            <MetaAvatar
              creators={creators.length ? [creators[0]] : undefined}
            />
            <span className={'artist-name'}>
              {creators[0]?.name ||
                creators[0]?.address?.substr(0, 6) ||
                'Go to auction'}
              ...
            </span>
          </div>
          <div className={'art-content-wrapper'}>
            <ArtContent
              className="auction-image no-events"
              preview={false}
              pubkey={id}
              allowMeshRender={false}
            />
          </div>
          <div className={'art-name'}>{name}</div>
          <div className="auction-info-container">
            <div className={'info-message'}>ENDING IN</div>
            <AuctionCountdown auctionView={auctionView} labels={false} />
          </div>
        </div>
      </div>
      <div className="card-bid-info">
        <span className={'text-uppercase info-message'}>{status}</span>
        <AmountLabel
          containerStyle={{ flexDirection: 'row' }}
          title={status}
          amount={amount}
          iconSize={24}
          tokenInfo={tokenInfo}
        />
      </div>
    </Card>
  );

  return card;
};

export const AuctionRenderCard2 = (props: AuctionCard) => {
  const { auctionView } = props;
  const id = auctionView.thumbnail.metadata.pubkey;
  const art = useArt(id);
  const creators = useCreators(auctionView);
  const name = art?.title || ' ';

  const tokenInfo = useTokenList().mainnetTokens.filter(
    m => m.address == auctionView.auction.info.tokenMint,
  )[0];
  const { status, amount } = useAuctionStatus(auctionView);

  const card = (
    <Card hoverable={true} className={`auction-render-card`} bordered={false}>
      <div className={'card-art-info'}>
        <div
          className="auction-gray-wrapper"
          style={{ background: 'rgb(33, 32, 45)', padding: 0 }}
        >
          <div className={'art-content-wrapper'}>
            <ArtContent
              className="auction-image no-events"
              preview={false}
              pubkey={id}
              allowMeshRender={false}
            />
          </div>
          <div style={{ padding: '16px' }}>
            <Title level={3}>{name}</Title>
            By&nbsp;
            <span className={'artist-name'} style={{ color: '#EC6FC2' }}>
              @
              {creators[0]?.name ||
                creators[0]?.address?.substr(0, 6) ||
                'Go to auction'}
              ...
            </span>
            <div
              className="info-container"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <div className="auction-info-container">
                <span className={'info-message'}>ENDING IN</span>
                <AuctionCountdown auctionView={auctionView} labels={false} />
              </div>
              <div className="card-bid-info" style={{ padding: '16px 0' }}>
                <span className={'text-uppercase info-message'}>{status}</span>
                <AmountLabel
                  containerStyle={{ flexDirection: 'row' }}
                  title={status}
                  amount={amount}
                  iconSize={24}
                  tokenInfo={tokenInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return card;
};
