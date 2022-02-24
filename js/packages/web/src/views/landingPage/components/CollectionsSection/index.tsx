import React, { useEffect, useState } from 'react';
import { Col, Row, Layout, Button } from 'antd';
import { Link } from 'react-router-dom';

const { Content } = Layout;

export const CollectionsSection = () => {
  return (
    <div className="collection-section">
      <Layout style={{ margin: 0, marginTop: 30 }}>
        <Row className="section-title-row">
          <div className="section-title">Top Collections By Period</div>
          <div>
            <Link to={`/home`}>
              <Button
                className="unimoon-button gradient-button"
                style={{ width: '85px' }}
              >
                24h
              </Button>
            </Link>
            <Link to={`/home`}>
              <Button
                className="unimoon-button transparent-button"
                style={{ width: '85px' }}
              >
                7d
              </Button>
            </Link>
            <Link to={`/home`}>
              <Button
                className="unimoon-button transparent-button"
                style={{ width: '85px' }}
              >
                All
              </Button>
            </Link>
          </div>
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
