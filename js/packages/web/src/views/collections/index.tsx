import React, { useEffect, useState } from 'react';
import { Col, Row, Layout } from 'antd';
import { ICollectionData } from '../../actions/collection/schema';
import { useCollections } from '../../hooks';
import { CollectionCard } from '../../components/CollectionCard';
import { CardLoader } from '../../components/MyLoader';

const { Content } = Layout;

export const Collections = () => {
  const [scrollPageNum, setScrollPageNum] = useState(1);
  const [search, setSearch] = useState('');
  const [searchCollections, searchAction] = useState<Array<ICollectionData>>(
    [],
  );

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
        searchAction(
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
      searchAction(collections.slice(0, 12));
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
              <div className="artwork-grid">
                {!collectionLoading ? (
                  searchCollections && searchCollections.length > 0 ? (
                    searchCollections.map((item, index) => (
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
            </Row>
          </Col>
        </Content>
      </Layout>
    </>
  );
};
