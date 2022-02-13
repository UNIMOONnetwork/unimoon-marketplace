import React, { useState } from 'react';
import {
  Row,
  Col,
  Divider,
  Layout,
  InputNumber,
  Avatar,
  Input,
  Button,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

import { useConnection } from '@oyster/common';
import { mintCollection } from '../../actions/collection/createCollection';
import { useCollections } from '../../hooks';
// import UploadService from '../../services/upload';
import { notify } from '../../utils/notifications';

const MAX_SIZE_LIMIT = 100;

export const CreateCollection = () => {
  const history = useHistory();
  const wallet = useWallet();
  const connection = useConnection();

  const [collectionName, setCollectionName] = useState<string>();
  const [collectionAvatar, setCollectionAvatar] = useState<
    string | ArrayBuffer | null | undefined
  >(); // to preview
  const [rawAvatar, setRawAvatar] = useState<string>(''); // to upload
  const [collectionDescription, setCollectionDescription] =
    useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [tooBig, setTooBig] = useState<boolean>(false);
  const [maxSize, setMaxSize] = useState<number>(MAX_SIZE_LIMIT);
  const [isExist, setIsExist] = useState<boolean>(false);

  const { Content } = Layout;
  const { TextArea } = Input;

  const handleFileSelect = ({ target }) => {
    if (target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setCollectionAvatar(reader.result); //to preview avatar
      reader.readAsDataURL(target.files[0]);

      setRawAvatar(target.files[0]); //to upload avatar
    }
  };

  const onSave = async () => {
    if (wallet?.publicKey) {
      if (wallet.publicKey && collectionName) {
        setLoading(true);
        try {
          const avatarUrl = ''; //await UploadService.uploadImage(rawAvatar);
          const collectionObject = {
            name: collectionName.padEnd(24),
            description: collectionDescription.padEnd(250),
            image: avatarUrl,
            maxSize: maxSize && maxSize > 0 ? maxSize : 0,
            members: [],
            memberOf: [],
          };
          try {
            await mintCollection(
              connection,
              wallet,
              collectionObject,
              wallet.publicKey.toBase58(),
            )
              .then(() => {
                notify({
                  type: 'success',
                  message: 'Collection has been created successfully',
                });
                setLoading(false);
                const baseCollectionsUrl = '/collections';
                const redirectUrl =
                  wallet && wallet.publicKey
                    ? `${baseCollectionsUrl}/${wallet.publicKey.toBase58()}/${
                        collectionObject.name
                      }`
                    : baseCollectionsUrl;
                history.push(redirectUrl);
                history.go(0);
              })
              .catch(err => {
                console.error(err);
                notify({
                  type: 'error',
                  message: 'Error occured in creating collection',
                });
                setLoading(false);
              });
          } catch (error) {
            notify({
              type: 'error',
              message: 'Error occured in creating collection',
            });
          }
        } catch (error) {
          notify({
            type: 'error',
            message: 'Error occured in creating collection',
          });
          return;
        }
      }
    } else {
      notify({
        type: 'info',
        message: 'Please connect to wallet!',
      });
      return;
    }
  };

  return (
    <>
      <div className="create-collection">
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
                        src={collectionAvatar?.toString()}
                      ></Avatar>
                    </label>
                  </div>
                </div>
                <Divider />
                <Row className="input-item">
                  <h6>Description</h6>
                  <TextArea
                    className="info-content"
                    rows={3}
                    onChange={e => setCollectionDescription(e.target.value)}
                    defaultValue={collectionDescription}
                  ></TextArea>
                </Row>
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
                    Collection
                  </div>
                </Row>
                <Row className="input-item">
                  <Col span={12}>
                    <h6 style={{ marginTop: 5 }}>Name</h6>
                    <Input
                      className="profile-input"
                      style={{ width: '100%' }}
                      placeholder="Name"
                      defaultValue={collectionName}
                      onChange={e => setCollectionName(e.target.value)}
                    />
                  </Col>
                </Row>

                <Row className="input-item">
                  <Col span={12}>
                    <h6 style={{ marginTop: 5 }}>Limit Size</h6>
                    <InputNumber
                      className="limit-input"
                      style={{ width: '100%' }}
                      placeholder="100"
                      defaultValue={maxSize}
                      min={1}
                      max={MAX_SIZE_LIMIT}
                      onChange={e => setMaxSize(e)}
                    />
                  </Col>
                </Row>
                <Row className="input-item">
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
