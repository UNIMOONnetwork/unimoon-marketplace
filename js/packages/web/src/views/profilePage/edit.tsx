import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Divider,
  Layout,
  Button,
  Avatar,
  Input,
  AutoComplete,
} from 'antd';
import { Redirect } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

import { useProfileContext } from '../../contexts/profile';
import profileService, { Profile } from '../../services/profile';

export const EditProfilePage = () => {
  const wallet = useWallet();
  const { connected } = useWallet();

  const { profile: defaultProfile, setProfile: setDefaultProfile } =
    useProfileContext();

  const [profile, setProfile] = useState<Profile | null>(defaultProfile);

  const [profileAvatar, setProfileAvatar] = useState<
    string | ArrayBuffer | null | undefined
  >(profile?.profile_image);
  const [rawAvatar, setRawAvatar] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const userId = wallet?.publicKey?.toString();

  const { Content } = Layout;
  const { TextArea } = Input;

  const handleFileSelect = ({ target }) => {
    console.log(target.files);
    if (target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setProfileAvatar(reader.result); //to preview avatar
      reader.readAsDataURL(target.files[0]);

      setRawAvatar(target.files[0]); //to upload avatar
    }
  };

  const displayWalletMessage = () => {
    // displayMessage({
    //   status: 'info',
    //   message: 'Please connect to wallet',
    // });
  };

  const onSave = async () => {
    setLoading(true);

    let avatarUrl = '';

    if (wallet?.publicKey) {
      if (profile) {
        if (rawAvatar != '') {
          // avatarUrl = await profileService.uploadImageToS3(rawAvatar);
        }

        const profileObject = profile;
        profileObject.profile_image = avatarUrl;

          profileService
            .updateProfile(wallet?.publicKey?.toBase58(), profileObject)
            .then((res: any) => {
              // displayMessage(res);
            })
            .catch(err => {
              if (err && err.message) {
                // displayMessage(err);
              } else {
                // displayErrorMessage();
              }
            })
            .finally(() => {
              setLoading(false);
            });

        setDefaultProfile({
          ...profile,
          profile_image: avatarUrl,
        });
      }
    } else {
      displayWalletMessage();
      return;
    }
  };

  if (!userId) {
    return <Redirect to={'/'} />;
  }

  const onProfileChange = changed => {
    console.log(changed);
    setProfile({
      ...profile,
      ...changed,
    });
  };

  return (
    <>
      <div className="editProfilePage">
        <Content>
          <Col>
            <Row style={{ marginTop: '64px' }}>
              <Col
                xs={{ span: 24 }}
                md={{ span: 12 }}
                style={{ padding: '30px' }}
              >
                <div className="thumbnail-wrapper">
                  <input
                    accept=".jpeg,.jpg,.png,.gif"
                    id="upload-button"
                    type="file"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <div className="thumbnail-content">
                    <label htmlFor="upload-button">
                      <Avatar
                        style={{ height: 300, width: 300, cursor: 'pointer' }}
                        src={profileAvatar?.toString()}
                      ></Avatar>
                    </label>
                  </div>
                </div>
                <Divider />

                <div className="info-header">ABOUT YOU</div>
                <TextArea
                  className="info-content"
                  rows={7}
                  onChange={e => onProfileChange({ bio: e.target.value })}
                  defaultValue={profile?.bio}
                ></TextArea>
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
                    Profile
                  </div>
                </Row>
                <Row>
                  <Col span={12}>
                    <h6 style={{ marginTop: 5 }}>Name</h6>
                    <AutoComplete
                      className="profile-input"
                      style={{ width: '100%' }}
                      placeholder="Name"
                      defaultValue={profile?.username}
                      onChange={e => onProfileChange({ username: e })}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <h6>Email</h6>
                    <AutoComplete
                      className="profile-input"
                      style={{ width: '100%' }}
                      placeholder="Email"
                      defaultValue={profile?.email}
                      onChange={e => onProfileChange({ email: e })}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <h6>Password</h6>
                    <Input.Password 
                      className="profile-input"
                      placeholder="input password" 
                      style={{ width: '100%' }}
                      onChange={e => onProfileChange({ password: e })}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <h6>Phone</h6>
                    <AutoComplete
                      className="profile-input"
                      style={{ width: '100%' }}
                      placeholder="Phone"
                      defaultValue={profile?.mobile}
                      onChange={e => onProfileChange({ mobile: e })}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <h6>Birthday</h6>
                    <AutoComplete
                      className="profile-input"
                      style={{ width: '100%' }}
                      placeholder="Birthday"
                      defaultValue={profile?.birthdate}
                      onChange={e => onProfileChange({ birthdate: e })}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Button onClick={onSave} className="action-btn save-btn">
                      Save
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Content>
      </div>
    </>
  );
};
