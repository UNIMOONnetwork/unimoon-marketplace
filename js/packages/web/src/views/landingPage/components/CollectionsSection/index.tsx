import React, { useEffect, useState } from 'react';
import { Col, Row, Layout, Avatar, Badge, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useCollections } from '../../../../hooks';
import { ICollectionData } from '../../../../actions/collection/schema';

const { Title } = Typography;
const { Content } = Layout;

const CollectionCard = props => {
  const { creator, image, name, members } = props;

  return (
    <>
      <Link to={`/collections/${creator}/${name.trim()}`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge count={members.length} offset={[-15, 15]} color="pink">
            <Avatar
              style={{ height: 110, width: 110, cursor: 'pointer' }}
              src={image}
            />
          </Badge>
          <Title level={2} style={{ margin: '0 0 0 20px' }}>
            {name}
          </Title>
        </div>
      </Link>
    </>
  );
};

export const CollectionsSection = () => {
  const { collections, collectionLoading } = useCollections();
  const [sortedCollections, sortCollections] = useState<ICollectionData[]>([]);

  useEffect(() => {
    const filtered = collections
      .sort((a, b) => b.members.length - a.members.length)
      .slice(0, 4);
    sortCollections(filtered);
  }, [collections]);

  return (
    <div className="collection-section">
      <Layout style={{ margin: 0, marginTop: 30 }}>
        <Row className="section-title-row">
          <div className="section-title">Top Collections</div>
        </Row>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 10 }}>
            <Row className="collection-group">
              {sortedCollections &&
                sortedCollections.length > 0 &&
                sortedCollections.map((item, index) => (
                  <CollectionCard {...item} key={index} />
                ))}
            </Row>
          </Col>
        </Content>
      </Layout>
    </div>
  );
};
