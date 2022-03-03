import React, { useEffect, useState } from 'react';
import { Col, Row, Layout } from 'antd';
import { useCollections } from '../../../../hooks';
import { ICollectionData } from '../../../../actions/collection/schema';
import { CollectionCard2 } from '../../../../components/CollectionCard';

const { Content } = Layout;

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
                  <CollectionCard2 {...item} key={index} />
                ))}
            </Row>
          </Col>
        </Content>
      </Layout>
    </div>
  );
};
