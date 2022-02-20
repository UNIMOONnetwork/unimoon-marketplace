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
import { storage } from '../../services/upload';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { notify } from '../../utils/notifications';
import { useCollections } from '../../hooks';

const { TextArea } = Input;
const MAX_SIZE_LIMIT = 100;

export const CreateCollectionView = () => {
  const history = useHistory();
  const wallet = useWallet();
  const connection = useConnection();

  const [collectionName, setCollectionName] = useState<string>();
  const [collectionAvatar, setCollectionAvatar] = useState<
    string | ArrayBuffer | null | undefined
  >();
  const [avatar, setAvatar] = useState<File>();
  const [collectionDescription, setCollectionDescription] =
    useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [maxSize, setMaxSize] = useState<number>(MAX_SIZE_LIMIT);

  const { Content } = Layout;

  const handleFileSelect = ({ target }) => {
    if (target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setCollectionAvatar(reader.result);
      reader.readAsDataURL(target.files[0]);

      setAvatar(target.files[0]);
    }
  };

  const onSave = async () => {
    if (wallet?.publicKey) {
      if (wallet.publicKey && collectionName) {
        setLoading(true);
        try {
          // Create the file metadata
          /** @type {any} */
          const metadata = {
            contentType: 'image/jpeg',
          };

          const storageRef = ref(storage, 'images/' + collectionName);
          const uploadTask = uploadBytesResumable(storageRef, avatar, metadata);

          uploadTask.on(
            'state_changed',
            snapshot => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            },
            error => {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case 'storage/unauthorized':
                  // User doesn't have permission to access the object
                  break;
                case 'storage/canceled':
                  // User canceled the upload
                  break;

                // ...

                case 'storage/unknown':
                  // Unknown error occurred, inspect error.serverResponse
                  break;
              }
            },
            () => {
              // Upload completed successfully, now we can get the download URL
              getDownloadURL(uploadTask.snapshot.ref).then(
                async downloadURL => {
                  const collectionObject = {
                    name: collectionName.padEnd(24),
                    description: collectionDescription.padEnd(250),
                    image: downloadURL,
                    maxSize: maxSize && maxSize > 0 ? maxSize : 0,
                    members: [],
                    memberOf: [],
                  };
                  try {
                    await mintCollection(
                      connection,
                      wallet,
                      collectionObject,
                      wallet?.publicKey.toBase58(),
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
                            ? `${baseCollectionsUrl}/${wallet.publicKey.toBase58()}/${collectionObject.name.trim()}`
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
                },
              );
            },
          );
        } catch (error) {
          console.log(error);
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
