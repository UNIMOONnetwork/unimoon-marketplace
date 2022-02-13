import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Layout, Button, Avatar } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

export const ProfileDetailPage = ({ profile }) => {

  const { Content } = Layout;

  return (
    <>
      <div className="editProfilePage">
        <Content>
          <Col>
            <Row>
              <Col
                xs={{ span: 24 }}
                md={{ span: 12 }}
                style={{ padding: '30px' }}
              >
                <div className="thumbnail-wrapper">
                  <Avatar
                    src={profile.profile_image?.toString()}
                    style={{ height: 300, width: 300, cursor: 'pointer' }}
                  ></Avatar>
                </div>
                <Divider />

                <div className="info-header">ABOUT THE USER</div>
                <div className="info-content">{profile.bio}</div>
                <br />
              </Col>
              {/* <Divider /> */}
              <Col
                xs={{ span: 24 }}
                md={{ span: 12 }}
                style={{
                  textAlign: 'left',
                  fontSize: '1.4rem',
                  padding: '20px',
                }}
              >
                <Row>
                  <div style={{ fontWeight: 700, fontSize: '4rem' }}>
                    {profile.username}
                  </div>
                </Row>
                <Row>
                  <Col span={6}>
                    <h6>Email</h6>
                    <div className="profile-email">{profile.email}</div>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <h6>Gender</h6>
                    <div className="profile-email">{profile.gender}</div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6 style={{ marginTop: 5 }}>Phone</h6>
                    <div className="profile-phone">{profile.mobile}</div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6 style={{ marginTop: 5 }}>Birthday</h6>
                    <div className="profile-phone">{profile.birthdate}</div>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <h6>Country Code</h6>
                    <div className="profile-email">{profile.country_code}</div>
                  </Col>
                </Row>
              </Col>
              <Col span="12" style={{ padding: '20px' }}></Col>
            </Row>
          </Col>
        </Content>
      </div>
    </>
  );
};
