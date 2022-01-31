import React, { useMemo } from 'react';

import { createGenericContext } from '../../utils/create-generic-context';
import {
  CollectionContextType,
  CollectionProviderProps,
} from './collection.types';
import { useFetchCollections } from '../../actions/collection';

const [useCollectionsContext, CollectionContextProvider] =
  createGenericContext<CollectionContextType>();

const CollectionProvider = ({ children }: CollectionProviderProps) => {
  const { collections, collectionLoading } = useFetchCollections();

  const collectionsByCreator = useMemo(() => {
    let result = {};
    collections.forEach(item => {
      if (result[item.creator]) {
        result[item.creator].push(item);
      } else {
        result[item.creator] = [item];
      }
    });
    return result;
  }, [collections]);

  return (
    <CollectionContextProvider
      value={{
        collectionLoading,
        collections,
        collectionsByCreator,
      }}
    >
      {children}
    </CollectionContextProvider>
  );
};

export { useCollectionsContext, CollectionProvider };
