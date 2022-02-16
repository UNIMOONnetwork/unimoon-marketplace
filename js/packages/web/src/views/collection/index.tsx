import React from 'react';
import { Col, Row, Layout } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { useCollections } from '../../hooks';
import { ArtCard } from '../../components/ArtCard';

const ART_CARD_SIZE = 250;
const { Content } = Layout;

export const CollectionView = () => {
  const { name, creator } = useParams<{ name: string; creator: string }>();
  const { collections } = useCollections(creator, name);

  return (
    <Layout style={{ margin: 0, marginTop: 30 }}>
      <Row>
        <div style={{ fontWeight: 700, fontSize: '3rem' }}>
          Collection/{name}
        </div>
      </Row>
      <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Col style={{ width: '100%', marginTop: 10 }}>
          <Row>
            <div className="artwork-grid">
              {collections[0] &&
                collections[0].members.map(pubkey => {
                  return (
                    <Link to={`/art/${pubkey}`}>
                      <ArtCard
                        pubkey={pubkey}
                        preview={false}
                        height={ART_CARD_SIZE}
                        width={ART_CARD_SIZE}
                        artView
                      />
                    </Link>
                  );
                })}
            </div>
          </Row>
        </Col>
      </Content>
    </Layout>
  );
};
