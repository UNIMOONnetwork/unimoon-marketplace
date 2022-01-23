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
import profileService from '../../services/profile';
// import { useNotiStack } from '../../components/NotiStack';
// import Input from '../../components/Input';
// import { Preview } from '../../components/Preview';
import { UserOutlined } from '@ant-design/icons';

export const EditProfilePage = () => {
  const wallet = useWallet();
  const { connected } = useWallet();
  // const { displayMessage } = useNotiStack();

  const { profile } = useProfileContext();

  const [profileAvatar, setProfileAvatar] =
    useState<string | ArrayBuffer | null | undefined>();
  const [rawAvatar, setRawAvatar] = useState<string>('');
  const [profileName, setProfileName] = useState<string>();
  const [profileUrl, setProfileUrl] = useState<string>();
  const [profileBio, setProfileBio] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const userId = wallet?.publicKey?.toString();

  const { Content } = Layout;
  const { TextArea } = Input;

  const handleFileSelect = ({ target }) => {
    if (target.files) {
      const reader = new FileReader();
      reader.onload = () => setProfileAvatar(reader.result); //to preview avatar
      reader.readAsDataURL(target.files[0]);

      setRawAvatar(target.files[0]); //to upload avatar
    }
  };

  const displayErrorMessage = () => {
    // displayMessage({
    //   status: 'error',
    //   message: 'There was an error updating your profile',
    // });
  };

  const displayWalletMessage = () => {
    // displayMessage({
    //   status: 'info',
    //   message: 'Please connect to wallet',
    // });
  };

  const handleSubmit = async () => {
    setLoading(true);

    let avatarUrl = '';
    let bannerUrl = '';

    if (wallet?.publicKey) {
      if (profile) {
        if (rawAvatar != '') {
          // avatarUrl = await profileService.uploadImageToS3(rawAvatar);
        }

        const profileObject = {
          name: profileName,
          description: profileBio,
          ownerId: wallet?.publicKey?.toString(),
          profileId: profileUrl,
          banner_url: bannerUrl == '' ? profile.banner_url : bannerUrl,
          imageUrl: avatarUrl == '' ? profile.imageUrl : avatarUrl,
          followers: profile.followers,
          following: profile.following,
          member_since: profile.member_since,
          on_sale: profile.on_sale,
          collectible: profile.collectible,
          created: profile.created,
          liked: profile.liked,
          activity: profile.activity,
        };

        //   profileService
        //     .updateProfile(wallet?.publicKey?.toBase58(), profileObject)
        //     .then((res: any) => {
        //       // displayMessage(res);
        //     })
        //     .catch(err => {
        //       if (err && err.message) {
        //         // displayMessage(err);
        //       } else {
        //         // displayErrorMessage();
        //       }
        //     })
        //     .finally(() => {
        //       setLoading(false);
        //     });
      }
    } else {
      displayWalletMessage();
      return;
    }
  };

  useEffect(() => {
    if (profile) {
      setProfileAvatar(profile.imageUrl);
      setProfileName(profile.name);
      setProfileUrl(profile.profileId);
      setProfileBio(profile.description);
    }
  }, [profile]);

  if (!userId) {
    return <Redirect to={'/'} />;
  }

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
                        src={profileAvatar?.toString()}
                        style={{ height: 200, width: 200, cursor: 'pointer' }}
                      ></Avatar>
                    </label>
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
                      options={[{ value: 'text 1' }, { value: 'text 2' }]}
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
                      options={[{ value: 'text 1' }, { value: 'text 2' }]}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span="12">
                <Divider />

                <div className="info-header">ABOUT YOU</div>
                <TextArea className="info-content"></TextArea>
                <br />
                {/*
                TODO: add info about artist
              <div className="info-header">ABOUT THE CREATOR</div>
              <div className="info-content">{art.about}</div> */}
              </Col>
              <Col span="6">
                <Divider />
                <Button className="action-btn save-btn">Save</Button>
              </Col>
            </Row>
          </Col>
        </Content>
      </div>
    </>
  );
};
