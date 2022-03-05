import { useState } from 'react';
import { Table, Input, Button, Space, Row, Col } from 'antd';
import ItemCard from './components/ItemCard';
import { useCollections } from '../../hooks';

export const StatsBoardView = () => {
  const { collections, collectionLoading } = useCollections();

  return (
    <div className="stats-board">
      <Row>
        <div style={{ fontWeight: 700, fontSize: '3rem', textAlign: 'center' }}>
          Top NFT Collections
        </div>
      </Row>
      <Row>
        <Col xs={4} sm={4} md={2} lg={2} style={{ paddingLeft: '15px' }}>
          #
        </Col>
        <Col xs={0} sm={0} md={2} lg={2}></Col>
        <Col xs={15} sm={15} md={8} lg={8}>
          Collection Name
        </Col>
        <Col xs={5} sm={5} md={4} lg={4}>
          NFT Count
        </Col>
        <Col xs={0} sm={0} md={4} lg={4}>
          Average Price
        </Col>
        <Col xs={0} sm={0} md={4} lg={4}>
          Min Price
        </Col>
      </Row>
      {collections.map((collection, index) => {
        return <ItemCard index={index} collection={collection} />;
      })}
    </div>
  );
};
