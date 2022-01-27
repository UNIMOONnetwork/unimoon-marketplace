import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Layout, Button, Avatar } from 'antd';
import { Redirect } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

import { useProfileContext } from '../../contexts/profile';
import profileService from '../../services/profile';
// import { useNotiStack } from '../../components/NotiStack';
// import Input from '../../components/Input';
// import { Preview } from '../../components/Preview';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

export const ProfileDetailPage = ({ profile }) => {
  const wallet = useWallet();

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

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
                  <div>
                    <Avatar
                      src={profile?.toString()}
                      style={{ height: 200, width: 200, cursor: 'pointer' }}
                    ></Avatar>
                  </div>
                </div>
              </Col>
              {/* <Divider /> */}
              <Col
                xs={{ span: 24 }}
                md={{ span: 12 }}
                style={{ textAlign: 'left', fontSize: '1.4rem' }}
              >
                <Row>
                  <div style={{ fontWeight: 700, fontSize: '4rem' }}>
                    {profile.name}
                  </div>
                </Row>
                <Row>
                  <Col span={6}>
                    <h6>Email</h6>
                    <div className="profile-email">{profile.email}</div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6 style={{ marginTop: 5 }}>Phone</h6>
                    <div className="profile-phone">{profile.phone}</div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6 style={{ marginTop: 5 }}>Edition</h6>
                  </Col>
                </Row>
              </Col>
              <Col span="12">
                <Divider />

                <div className="info-header">ABOUT THE USER</div>
                <div className="info-content">{profile.description}</div>
                <br />
                {/*
                TODO: add info about artist
              <div className="info-header">ABOUT THE CREATOR</div>
              <div className="info-content">{art.about}</div> */}
              </Col>
            </Row>
          </Col>
        </Content>
      </div>
    </>
  );
};
