import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { StringPublicKey } from '@oyster/common';

import { HistoryData } from '../types';
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
    window.fetch(`https://burntsupremacy.com/api/walletrank`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(tx),
    });
  }
};

export const updateItemTradeHistory = async (data: HistoryData) => {
  window.fetch(`https://burntsupremacy.com/api/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(data),
  });
};

/**
 *
 * @param which comma separated list of the type of history to get e.g. listing,sales e.t.c.
 * @returns {HistoryData}
 */
export const getItemHistory = async (item: string, which: string) => {
  return await window
    .fetch(
      `https://burntsupremacy.com/api/history?item=${item}&type=${which}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      },
    )
    .then(res => res.json())
    .then(res => res.msg || []);
};

export const getNFTDay = async () => {
  return window
    .fetch(`https://burntsupremacy.com/api/nft/highest`, {
      method: 'get',
      mode: 'cors',
    })
    .then(res => res.json())
    .then(res => res);
};
