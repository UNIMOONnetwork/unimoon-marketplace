import React, { useEffect, useState } from 'react';
import { Col, Row, Layout, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useMeta } from '@oyster/common';
import Masonry from 'react-masonry-css';
import { ArtistCard2 } from '../../../../components/ArtistCard';

const { Content } = Layout;

export const CreatorsSection = () => {
  const { whitelistedCreatorsByCreator } = useMeta();
  const artistsImgs = [
    '/img/artist1.png',
    '/img/artist2.png',
    '/img/artist3.png',
    '/img/artist4.png',
  ];

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const items = Object.values(whitelistedCreatorsByCreator);

  return (
    <div className="creators-section">
      <Layout style={{ margin: 0, marginTop: 30 }}>
        <Row className="section-title-row">
          <div className="section-title">Top Creators</div>
          <Link to={`/artists`}>
            <Button className="unimoon-button transparent-button">
              Explore More
            </Button>
          </Link>
        </Row>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 10 }}>
            <Row>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid artists-masonry"
                columnClassName="my-masonry-grid_column"
              >
                {items.slice(0, 4).map((m, idx) => {
                  const id = m.info.address;
                  return (
                    <Link to={`/profile/${id}`} key={idx}>
                      <ArtistCard2
                        key={id}
                        artist={{
                          address: m.info.address,
                          name: m.info.name || '',
                          image: m.info.image || '',
                          link: m.info.twitter || '',
                          background: m.info.background || artistsImgs[idx],
                        }}
                      />
                    </Link>
                  );
                })}
              </Masonry>
            </Row>
          </Col>
        </Content>
      </Layout>
    </div>
  );
};
