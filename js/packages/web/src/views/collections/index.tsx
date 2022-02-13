import React, { useEffect, useState } from 'react';
import { Col, Row, Layout } from 'antd';
import { ICollectionData } from '../../actions/collection/schema';
import { useCollections } from '../../hooks';
import { CollectionCard } from '../../components/CollectionCard';
import { CardLoader } from '../../components/MyLoader';

const { Content } = Layout;

export const CollectionsContentView = ({ loading, collections }) => {
  return (
    <div className="artwork-grid">
      {!loading ? (
        collections && collections.length > 0 ? (
          collections.map((item, index) => (
            <CollectionCard {...item} key={index} />
          ))
        ) : (
          <span>No filtered collections</span>
        )
      ) : (
        Array(4)
          .fill({})
          .map((_, index) => <CardLoader key={index} />)
      )}
    </div>
  );
};

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
    <>
      <Layout style={{ margin: 0, marginTop: 30 }}>
        <Row>
          <div style={{ fontWeight: 700, fontSize: '3rem' }}>Collections</div>
        </Row>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 10 }}>
            <Row>
              <CollectionsContentView
                loading={collectionLoading}
                collections={filteredCollections}
              />
            </Row>
          </Col>
        </Content>
      </Layout>
    </>
  );
};
