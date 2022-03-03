import { useState } from 'react';
import { Table, Input, Button, Space, Row, Col } from 'antd';
import ItemCard from './components/ItemCard';
import { useCollections } from '../../hooks';

export const StatsBoardView = () => {
  const { collections, collectionLoading } = useCollections();

  return (
    <div className="stats-board">
      <Row>
        <div style={{ fontWeight: 700, fontSize: '3rem' }}>
          Top NFT Collections
        </div>
      </Row>
      <Row>
        <Col span={2} style={{ paddingLeft: '15px' }}>
          #
        </Col>
        <Col span={2}></Col>
        <Col xs={15} sm={15} md={7} lg={7}>
          Collection Name
        </Col>
        <Col xs={5} sm={5} md={4} lg={4}>
          Marketcap
        </Col>
        <Col xs={0} sm={0} md={3} lg={3}>
          7d Volume
        </Col>
        <Col xs={0} sm={0} md={3} lg={3}>
          Average Price
        </Col>
        <Col xs={0} sm={0} md={3} lg={3}>
          Min Price
        </Col>
      </Row>
      {collections.map((collection, index) => {
        return <ItemCard index={index} collection={collection} />;
      })}
    </div>
  );
};
