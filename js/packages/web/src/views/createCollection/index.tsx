import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
// import * as Yup from 'yup';

import { uploadImageToS3 } from '../../hooks/useCollections';
import { useConnection } from '@oyster/common';
import { mintCollection } from '../../actions/collection/createCollection';
import { ICollectionData } from '../../types';
import { useCollections } from '../../hooks';

const MAX_SIZE_DEFAULT = 200;
const MAX_SIZE_LIMIT = 200;

export const CreateCollection = () => {
  const history = useHistory();
  const wallet = useWallet();
  const connection = useConnection();
  const { connected } = useWallet();
  // const { displayMessage } = useNotiStack();
  const displayMessage = data => {};
  const { collections } = useCollections(wallet.publicKey?.toBase58());

  const [collectionName, setCollectionName] = useState<string>();
  const [collectionAvatar, setCollectionAvatar] = useState<
    string | ArrayBuffer | null | undefined
  >(); // to preview
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

  // const schema = Yup.object().shape({
  //   collectionAvatar: Yup.string().required('Collection Avatar is required!'),
  //   collectionName: Yup.string()
  //     .required('Collection Name is required!')
  //     .max(25, 'Collection Name is too long, max length is 25'),
  //   collectionDes: Yup.string()
  //     .required('Colleciton Description is required')
  //     .max(250, 'Description is too long, max lenght is 250'),
  // });

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
      // schema
      //   .validate(
      //     {
      //       collectionAvatar,
      //       collectionName,
      //       collectionDes,
      //       // collectionSymbol,
      //     },
      //     { abortEarly: true },
      //   )
      //   .then(async () => {
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
      // })
      // .catch(err => {
      //   err.errors?.forEach(message => {
      //     displayMessage({ message, status: 'error' });
      //   });
      // });
    } else {
      displayMessage({
        message: 'Please connect to wallet!',
        status: 'info',
      });
      return;
    }
  };

  return <></>;
};
