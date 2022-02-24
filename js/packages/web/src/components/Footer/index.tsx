import React from 'react';
import { SendOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Typography, Layout, Row, Col, Button } from 'antd';

const { Text, Title } = Typography;

const { Content } = Layout;

export const Footer = () => {
  return (
    <div className="footer-container">
      <Layout>
        <Content
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            backgroundColor: 'rgb(18, 18, 18)',
          }}
        >
          <Col span={8}>
            <Row>
              <img src="/unimoon-logo.png" />
              <div className="logo-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Scelerisque urna, faucibus nunc nibh quisque quis cursus iaculis
                diam. Est a, quis lorem a sit pharetra. Eu senectus tincidunt
                lorem faucibus ac sed dignissim.
              </div>
            </Row>
          </Col>
          <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
            <Row>
              <Title level={4}>Quick Links</Title>
              <Link to={`/home`}>Explore</Link>
              <Link to={`/art/create`}>Create</Link>
              <Link to={`/`}>Market</Link>
            </Row>
          </Col>
          <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
            <Row style={{ display: 'inline-grid' }}>
              <Title level={4}>Contact</Title>
              <Link to={`/#`}>+1 210 891 4661</Link>
              <Link to={`/#`}>admin@unimoon.com</Link>
              <div>
                <img src="/fb.png" />
                <img src="/tw.png" style={{ marginLeft: '20px' }} />
                <img src="/ig.png" style={{ marginLeft: '20px' }} />
              </div>
            </Row>
          </Col>
        </Content>
      </Layout>
      <div className="footer-foot">
        <div className="small-body footer-link">
          UNIMOON © 2022. All rights reserved
        </div>
      </div>
    </div>
  );
};
