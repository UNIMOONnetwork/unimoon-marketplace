import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';

import { Header } from '../../components/Header';
import FilterBar from '../../components/FilterBar';
import { CollectionCard } from '../../components/CollectionCard';
import { LoadingCard } from '../../components/LoadingCard';
import { ICollectionData } from '../../actions/collection/schema';
import { useCollections } from '../../hooks';

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

  return (
    <>
      <Header />
      <Grid className="collections-view-container" item xs={12}>
        <div className="header">
          <div className="gt-italic-normal-grey f250 label">Collections</div>
          <div className="gt-italic-normal-grey f32 count"></div>
        </div>

        <FilterBar
          filter={filter}
          filters={filters}
          order={order}
          orders={orders}
          search={search}
          filterAction={value => setFilter(value)}
          searchAction={value => {
            setSearch(value);

            const result = sortCollection(order);
            searchAction(
              result
                .filter(item => item.name.toLowerCase().includes(value))
                .slice(0, 12),
            );

            setScrollPageNum(1);
          }}
          orderAction={value => {
            setOrder(value);

            const result = sortCollection(value);
            searchAction(
              result
                .filter(item => item.name.toLowerCase().includes(search))
                .slice(0, 12),
            );

            setScrollPageNum(1);
          }}
        />

        <Grid container style={{ justifyContent: 'center' }}>
          {!collectionLoading ? (
            searchCollections && searchCollections.length > 0 ? (
              searchCollections.map((item, index) => (
                <CollectionCard {...item} key={index} />
              ))
            ) : (
              <Typography
                variant="h6"
                className="suisse-normal-grey"
                style={{ marginTop: 50 }}
              >
                No filtered collections
              </Typography>
            )
          ) : (
            Array(4)
              .fill({})
              .map((_, index) => (
                <div key={index}>
                  <LoadingCard width={300} height={200} />
                </div>
              ))
          )}
        </Grid>
      </Grid>
    </>
  );
};
