import React, { useEffect, useState } from 'react';
import { Col, Row, Layout, Button } from 'antd';
import { Link } from 'react-router-dom';

const { Content } = Layout;

export const RecentListSection = () => {
  return (
    <>
      <Layout style={{ margin: 0, marginTop: 30 }}>
        <Row className="section-title-row">
          <div className="section-title">Recently Listed</div>
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
    </>
  );
};
