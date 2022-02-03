import React, { useEffect, useState } from 'react';
import { Col, Layout } from 'antd';
import Masonry from 'react-masonry-css';
import { ICollectionData } from '../../actions/collection/schema';
import { useCollections } from '../../hooks';
import { CollectionCard } from '../../components/CollectionCard';
import { CardLoader } from '../../components/MyLoader';

const { Content } = Layout;
const filters = [];

const orders = [
  { value: 'asc-name', label: 'Sort by Name ASC' },
  { value: 'desc-name', label: 'Sort by Name DESC' },
];

export const CollectionsView = () => {
  const [filter, setFilter] = useState('');
  const [order, setOrder] = useState('asc-name');
  const [scrollPageNum, setScrollPageNum] = useState(1);
  const [search, setSearch] = useState('');
  const [searchCollections, searchAction] = useState<Array<ICollectionData>>(
    [],
  );

  const sortCollection = (value: String) => {
    const keys = value.split('-');

    collections.sort((a, b) => {
      let keyA: any;
      let keyB: any;

      if (keys[1] == 'name') {
        keyA = a.name.toLowerCase();
        keyB = b.name.toLowerCase();
      }

      if (keys[0] == 'asc') {
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
      }
      if (keys[0] == 'desc') {
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
      }

      return 0;
    });

    return collections;
  };

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
        const result = sortCollection(order);
        searchAction(
          result
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
      searchAction(sortCollection('asc-name').slice(0, 12));
    }
  }, [collections]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <>
      <Layout style={{ margin: 0, marginTop: 30 }}>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 10 }}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid artists-masonry"
              columnClassName="my-masonry-grid_column"
            >
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
            </Masonry>
          </Col>
        </Content>
      </Layout>
    </>
  );
};
