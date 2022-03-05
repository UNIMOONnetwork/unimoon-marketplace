import React, { useEffect, useState } from 'react';
import { Col, Row, Layout, Typography } from 'antd';
import { ICollectionData } from '../../actions/collection/schema';
import { useCollections } from '../../hooks';
import { CollectionCard2 } from '../../components/CollectionCard';

const { Content } = Layout;
const { Title } = Typography;

export const CollectionsView = () => {
  const [scrollPageNum, setScrollPageNum] = useState(1);
  const [search, setSearch] = useState('');
  const [filteredCollections, setFilteredCollections] = useState<
    Array<ICollectionData>
  >([]);

  const handleScroll = async () => {
    if (
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight
    ) {
      if (
        collections.filter(item => item.name.toLowerCase().includes(search))
          .length >
        12 * scrollPageNum
      ) {
        setFilteredCollections(
          collections
            .filter(item => item.name.toLowerCase().includes(search))
            .slice(0, 12 * (scrollPageNum + 1)),
        );
        setScrollPageNum(scrollPageNum + 1);
      }
    }
  };

  const { collections, collectionLoading } = useCollections();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  useEffect(() => {
    if (collections) {
      setFilteredCollections(collections.slice(0, 12));
    }
  }, [collections]);

  return (
    <div className="collections-view">
      <Layout style={{ margin: 0, marginTop: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '3rem', textAlign: 'center' }}>
          Collections
        </div>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 10 }}>
            <Row className="collection-group">
              {filteredCollections &&
                filteredCollections.length > 0 &&
                filteredCollections.map((item, index) => (
                  <CollectionCard2 {...item} key={index} />
                ))}
            </Row>
          </Col>
        </Content>
      </Layout>
    </div>
  );
};
