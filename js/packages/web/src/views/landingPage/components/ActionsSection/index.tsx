import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Layout, Row, Col, Button } from 'antd';
import { ConnectButton } from '@oyster/common';

const { Text, Title } = Typography;
const { Content } = Layout;

const ActionCard = ({ imgSrc, title, description, buttonType }) => {
  return (
    <>
      <div className="action-card">
        <img src={imgSrc} style={{ marginTop: '60px', height: '229px' }} />
        <Title level={4} style={{ marginTop: '30px' }}>
          {title}
        </Title>
        <div
          style={{
            marginTop: '30px',
            width: '70%',
            marginLeft: '15%',
            marginRight: '15%',
            marginBottom: '30px',
          }}
        >
          <Text>{description}</Text>
        </div>
        <div style={{ marginBottom: '30px' }}>
          {buttonType == 'Connect' ? (
            <ConnectButton className="unimoon-button gradient-button" />
          ) : buttonType == 'Create' ? (
            <Link to={`/create/collection`} style={{ width: '100%' }}>
              <Button className="unimoon-button gradient-button">
                {buttonType}
              </Button>
            </Link>
          ) : (
            <Link to={`/art/create`} style={{ width: '100%' }}>
              <Button className="unimoon-button gradient-button">
                {buttonType}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export const ActionsSection = () => {
  return (
    <div id="actions-section">
      <Layout style={{ margin: 0, marginTop: 30 }}>
        <Row className="section-title-row">
          <div className="section-title">
            Create collections and sell your NFTs
          </div>
        </Row>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 10 }}>
            <Row className="action-group">
              <ActionCard
                imgSrc="/Connect Wallet.png"
                title="Connect your Wallet"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Accumsan sit tortor eu mollis libero, neque, urna, sed. Mi metus aenean eget vestibulum neque."
                buttonType="Connect"
              />
              <ActionCard
                imgSrc="/Collect Collections.png"
                title="Create your Collection"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Accumsan sit tortor eu mollis libero, neque, urna, sed. Mi metus aenean eget vestibulum neque."
                buttonType="Create"
              />
              <ActionCard
                imgSrc="/Mint NFTs.png"
                title="Mint your NFTs"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Accumsan sit tortor eu mollis libero, neque, urna, sed. Mi metus aenean eget vestibulum neque."
                buttonType="Mint"
              />
            </Row>
          </Col>
        </Content>
      </Layout>
    </div>
  );
};
