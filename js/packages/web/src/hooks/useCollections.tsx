import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { StringPublicKey } from '@oyster/common';

import { useCollectionsContext } from '../contexts/collection';

export const useCollections = (
  creatorKey?: StringPublicKey | null | undefined,
  collectionName?: string,
) => {
  const {
    collections: allCollections,
    collectionsByCreator,
    collectionLoading,
  } = useCollectionsContext();

  const collections = useMemo(() => {
    let result = allCollections;
    if (creatorKey) {
      result = collectionsByCreator[creatorKey] || [];
    }
    if (collectionName) {
      result = result.filter(
        col => col.name.toLowerCase() === collectionName.toLowerCase(),
      );
    }
    return result || [];
  }, [allCollections]);

  return {
    collectionLoading,
    collections,
    collectionsByCreator,
  };
};

export const uploadImageToS3 = async (image: any) => {
  const formData = new FormData();
  formData.append('image', image);

  const res = await axios.post(
    `${process.env.NEXT_APP_BASE_URL}/images`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  if (res.data) return `${process.env.NEXT_APP_BASE_URL}/images/${res.data}`;
  return '';
};

export const updateUserTx = async (tx: {
  address: string | undefined;
  price: number;
  nft: string;
  type: string;
}) => {
  if (tx.address) {
    window.fetch(`http://localhost/v1/rank`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(tx),
    });
  }
};
