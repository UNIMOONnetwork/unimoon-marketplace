import React, { useContext, useMemo, ReactNode } from 'react';

import { useFetchCollections } from '../actions/collection';

import { ICollectionData } from '../actions/collection/schema';

export type CollectionContextType = {
  collectionLoading: boolean;
  collections: Array<ICollectionData>;
  collectionsByCreator: Object;
};

export type CollectionProviderProps = {
  children: ReactNode;
};

const CollectionContext = React.createContext<CollectionContextType | null>(
  null,
);

export const CollectionProvider = ({ children }: CollectionProviderProps) => {
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
    <CollectionContext.Provider
      value={{
        collectionLoading,
        collections,
        collectionsByCreator,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollectionsContext = () => {
  const context = useContext(CollectionContext);
  return context as CollectionContextType;
};
