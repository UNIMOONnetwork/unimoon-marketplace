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
        col => col.name.trim().toLowerCase() === collectionName.toLowerCase(),
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
