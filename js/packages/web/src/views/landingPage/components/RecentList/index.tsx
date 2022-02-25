import React, { useEffect, useState } from 'react';
import { Col, Row, Layout, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useMeta } from '@oyster/common';
import { ArtCard2 } from '../../../../components/ArtCard';
import { isMetadata } from '../../../artworks/utils';
import { Item } from '../../../artworks/types';

const { Content } = Layout;

export const RecentListSection = () => {
  const { metadata } = useMeta();

  return (
    <div className="recentlist-section">
      <Layout style={{ margin: 0, marginTop: 30 }}>
        <Row className="section-title-row">
          <div className="section-title">Recently Listed</div>
          <Link to={`/artworks`}>
            <Button className="unimoon-button transparent-button">
              Explore More
            </Button>
          </Link>
        </Row>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 10 }}>
            <Row>
              <div className="artwork-grid">
                {metadata &&
                  metadata.length > 0 &&
                  metadata.slice(0, 4).map((item: Item) => {
                    const pubkey = isMetadata(item)
                      ? item.pubkey
                      : item.metadata.pubkey;

                    return (
                      <Link to={`/art/${pubkey}`}>
                        <ArtCard2 pubkey={pubkey} artView />
                      </Link>
                    );
                  })}
              </div>
            </Row>
          </Col>
        </Content>
      </Layout>
    </div>
  );
};
