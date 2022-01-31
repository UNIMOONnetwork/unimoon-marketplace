import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Button,
  CircularProgress,
  Container,
  TextField,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { ArrowForward } from '@material-ui/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import * as Yup from 'yup';

import { uploadImageToS3 } from '../../hooks/useCollections';
import { Header } from '../../components/Header';
import { Preview } from '../../components/Preview';
import { useNotiStack } from '../../components/NotiStack';
import UploadFileButton from '../../components/UploadFileButton';
import { PageTitle } from '../createAuctionView';
import { useConnection } from '@oyster/common';
import { mintCollection } from '../../actions/collection/createCollection';
import { ICollectionData } from '../../types';
import { useCollections } from '../../hooks';

const MAX_SIZE_DEFAULT = 200;
const MAX_SIZE_LIMIT = 200;

export const CreateCollectionView = () => {
  const history = useHistory();
  const wallet = useWallet();
  const connection = useConnection();
  const { connected } = useWallet();
  const { displayMessage } = useNotiStack();
  const { collections } = useCollections(wallet.publicKey?.toBase58());

  const [collectionName, setCollectionName] = useState<string>();
  const [collectionAvatar, setCollectionAvatar] =
    useState<string | ArrayBuffer | null | undefined>(); // to preview
  const [rawAvatar, setRawAvatar] = useState<string>(''); // to upload
  const [collectionDes, setCollectionDesc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [tooBig, setTooBig] = useState<boolean>(false);
  const [maxSize, setMaxSize] = useState<number>(MAX_SIZE_DEFAULT);
  const [removable, setRemovable] = useState<boolean>(true);
  const [arrangeable, setArrangeable] = useState<boolean>(true);
  const [expandable, setExpandable] = useState<boolean>(true);
  const [isExist, setIsExist] = useState<boolean>(false);

  const schema = Yup.object().shape({
    collectionAvatar: Yup.string().required('Collection Avatar is required!'),
    collectionName: Yup.string()
      .required('Collection Name is required!')
      .max(25, 'Collection Name is too long, max length is 25'),
    collectionDes: Yup.string()
      .required('Colleciton Description is required')
      .max(250, 'Description is too long, max lenght is 250'),
  });

  const handleFileSelect = file => {
    const reader = new FileReader();
    reader.onload = () => setCollectionAvatar(reader.result); //to preview avatar
    reader.readAsDataURL(file);
    setRawAvatar(file); //to upload avatar
    setTooBig(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'maxSize') {
      let result =
        value < 0 ? 0 : value > MAX_SIZE_LIMIT ? MAX_SIZE_LIMIT : value;
      setMaxSize(result);
    } else if (name === 'collectionName') {
      setCollectionName(value);
      let exist = false;
      collections.forEach(item => {
        let a = item.name.trim().toLowerCase();
        let b = value.trim().toLowerCase();
        if (a === b) exist = true;
      });
      setIsExist(exist);
    }
  };

  const displayErrorMessage = (updating?: boolean) => {
    const creatingErrorMessage = 'There was an error creating your collection';
    const updatingErrorMessage = 'Error uploading your collection display';
    displayMessage({
      message: updating ? updatingErrorMessage : creatingErrorMessage,
      status: 'error',
    });
  };

  const handleSubmit = async () => {
    if (wallet?.publicKey) {
      schema
        .validate(
          {
            collectionAvatar,
            collectionName,
            collectionDes,
            // collectionSymbol,
          },
          { abortEarly: true },
        )
        .then(async () => {
          if (wallet.publicKey && collectionName) {
            setLoading(true);
            try {
              const avatarUrl = await uploadImageToS3(rawAvatar);
              const collectionObject = {
                name: collectionName.padEnd(24),
                description: collectionDes.padEnd(250),
                image: avatarUrl,
                removable,
                arrangeable,
                expandable,
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
                    displayMessage({
                      message: 'Collection has been created successfully',
                      status: 'success',
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
                    displayErrorMessage();
                    setLoading(false);
                  });
              } catch (error) {
                displayErrorMessage();
              }
            } catch (error) {
              displayErrorMessage(true);
              return;
            }
          }
        })
        .catch(err => {
          err.errors?.forEach(message => {
            displayMessage({ message, status: 'error' });
          });
        });
    } else {
      displayMessage({
        message: 'Please connect to wallet!',
        status: 'info',
      });
      return;
    }
  };

  return (
    <>
      <Header isGoBack />
      <Container className="create-collection-view">
        <Grid container justifyContent="center" className="paneContainer">
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            lg={3}
            xl={3}
            className="leftContainer"
          >
            <PageTitle title="Create Collection" />
            <div className="thumbnail-wrapper">
              <div
                style={{
                  backgroundImage: `url(${collectionAvatar?.toString()})`,
                }}
                className="thumbnail"
              ></div>
            </div>
            <div className="suisse-normal-black f32 collection-name">
              {collectionName ? collectionName : 'Collection Name'}
            </div>
            <div className="suisse-normal-grey f14 collection-description">
              {collectionDes ? collectionDes : 'No description'}
            </div>
            <div className="preview-btns">
              <Button
                className="createCollectionPreviewButton"
                variant="contained"
                disableElevation
                fullWidth
                disabled={!connected || loading || isExist}
                onClick={handleSubmit}
              >
                {loading && (
                  <CircularProgress
                    size={20}
                    thickness={7}
                    style={{ color: '#FFFFFF', marginRight: 10 }}
                  />
                )}
                Continue
              </Button>
            </div>
          </Grid>
          <Grid item xs={2} md={1} />
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            lg={5}
            xl={5}
            className="rightContainer"
          >
            <Grid
              container
              alignItems="center"
              spacing={2}
              className="thumbnail-wrapper"
            >
              {/* <input
                accept=".jpeg,.jpg,.png,.gif,.glb,.svg"
                id="upload-button"
                type="file"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              /> */}
              <Grid item xs={12}>
                <div className="suisse-normal-black f24">
                  Upload the thumbnail
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="suisse-normal-black f14">
                  We recommend an image of at least 400x400. Gifs works too.
                </div>
              </Grid>
              <Grid item xs={12}>
                {/* <label htmlFor="upload-button">
                  <Button
                    variant="contained"
                    className="choose-file-button"
                    component="span"
                  >
                    Choose file <ArrowForward />
                  </Button>
                </label> */}
                <UploadFileButton
                  accept={'.jpeg, .jpg, .png, .gif, .webp, .mp4, .mp3,.mkv'}
                  onUploaded={handleFileSelect}
                />
              </Grid>
              {tooBig && (
                <span style={{ color: '#FF306E' }}>The file is too big</span>
              )}
            </Grid>
            <Grid container spacing={3} className="detailsContainer">
              <Grid item xs={12}>
                <div className="suisse-normal-black f24">Fill the details</div>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Collection Name"
                  id="collectionName"
                  name="collectionName"
                  error={isExist}
                  helperText={isExist ? 'Already exist!' : ''}
                  placeholder="Max length 25"
                  fullWidth
                  inputProps={{
                    maxlength: 25,
                  }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description (optional)"
                  fullWidth
                  multiline
                  maxRows={5}
                  placeholder="Max length 250"
                  inputProps={{
                    maxlength: 250,
                  }}
                  onChange={e => setCollectionDesc(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Max Size (optional)"
                  fullWidth
                  type="number"
                  id="maxSize"
                  name="maxSize"
                  aria-describedby="max-size"
                  value={maxSize}
                  inputProps={{
                    min: 0,
                    max: MAX_SIZE_LIMIT,
                  }}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Accordion className="advanced-setting">
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="advanced-setting"
                    id="advanced-setting"
                  >
                    <div className="suisse-normal-black f24">
                      Advanced Settings
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item container xs={12} spacing={2}>
                      <Grid item container alignItems="center">
                        <Grid item xs={6}>
                          <div className="suisse-normal-black">Removable</div>
                        </Grid>
                        <Grid item xs={6} style={{ textAlign: 'right' }}>
                          <Switch
                            checked={removable}
                            onChange={e => setRemovable(!removable)}
                            name="removable"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <div className="suisse-normal-grey">
                            Items in this collection can be removed by the owner
                          </div>
                        </Grid>
                      </Grid>
                      <Grid item container alignItems="center">
                        <Grid item xs={6}>
                          <div className="suisse-normal-black">Arrangeable</div>
                        </Grid>
                        <Grid item xs={6} style={{ textAlign: 'right' }}>
                          <Switch
                            checked={arrangeable}
                            onChange={e => setArrangeable(!arrangeable)}
                            name="arrangeable"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <div className="suisse-normal-grey">
                            The order of items in this collection can be
                            rearranged by the owner
                          </div>
                        </Grid>
                      </Grid>
                      <Grid item container alignItems="center">
                        <Grid item xs={6}>
                          <div className="suisse-normal-black">Expandable</div>
                        </Grid>
                        <Grid item xs={6} style={{ textAlign: 'right' }}>
                          <Switch
                            checked={expandable}
                            onChange={e => setExpandable(!expandable)}
                            name="expandable"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <div className="suisse-normal-grey">
                            Items can be appended to this collection in the
                            future
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Preview
          url={collectionAvatar?.toString()}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      </Container>
    </>
  );
};
