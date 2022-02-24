import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Space, Row, Col, Button } from 'antd';

const { Text, Title } = Typography;

export const HeaderSection = () => {
  return (
    <div className="header-section">
      <Row style={{ alignItems: 'center' }}>
        <Col md={{ span: 24 }} lg={{ span: 10 }}>
          <Text
            style={{ fontSize: '25px', color: '#EC6FC2', lineHeight: '36px' }}
          >
            Unimoon Marketplace
          </Text>
          <Title level={2}>A New Experiment For Digital Art Work</Title>
          <Text
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '36px',
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Leo quis
            lectus velit sed id maecenas sollicitudin nisi, ac.
          </Text>
          <div className="action-group">
            <Link to={`/home`} style={{ width: '100%' }}>
              <Button className="unimoon-button gradient-button">
                Explore
              </Button>
            </Link>
            <Link to={`/art/create`} style={{ width: '100%' }}>
              <Button className="unimoon-button transparent-button">
                Create
              </Button>
            </Link>
          </div>
        </Col>
        <Col
          xs={{ span: 0 }}
          sm={{ span: 0 }}
          md={{ span: 0 }}
          lg={{ span: 14 }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/preview1.png" height={739} />
            <img src="/preview2.png" height={571} />
          </div>
        </Col>
      </Row>
    </div>
  );
};
