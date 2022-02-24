import React, { useEffect, useState } from 'react';
import { Col, Row, Layout, Button } from 'antd';
import { Link } from 'react-router-dom';

const { Content } = Layout;

export const AuctionsSection = () => {
  return (
    <div id="auctions-section">
      <Layout style={{ margin: 0, marginTop: 30 }}>
        <Row className="section-title-row">
          <div className="section-title">Limited Auctions</div>
          <Link to={`/home`}>
            <Button className="unimoon-button transparent-button">
              Explore More
            </Button>
          </Link>
        </Row>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 10 }}>
            <Row></Row>
          </Col>
        </Content>
      </Layout>
    </div>
  );
};
