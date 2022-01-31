import { ReactNode } from 'react';

import { ICollectionData } from '../../actions/collection/schema';

export type CollectionContextType = {
  collectionLoading: boolean;
  collections: Array<ICollectionData>;
  collectionsByCreator: Object;
};

export type CollectionProviderProps = {
  children: ReactNode;
};
