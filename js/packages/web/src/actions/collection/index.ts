import { useState, useEffect } from 'react';
import { programIds, toPublicKey, useConnection } from '@oyster/common';
import { decodeCollectionData, ICollectionData } from './schema';

export const useFetchCollections = (creator?: string, name?: string) => {
  const connection = useConnection();
  const [collections, setCollections] = useState<Array<ICollectionData>>([]);
  const [myCollections, setMyCollections] = useState<Array<ICollectionData>>(
    [],
  );
  const [collectionLoading, setCollectionLoading] = useState<boolean>(true);

  const col: ICollectionData[] = [];
  const myCol: ICollectionData[] = [];
  useEffect(() => {
    connection
      .getProgramAccounts(toPublicKey(programIds().collection))
      .then(res => {
        res.forEach(account => {
          try {
            const decoded = decodeCollectionData(account.account.data);
            decoded.pubkey = account.pubkey.toBase58();
            try {
              const { hostname, pathname } = new URL(decoded.image);
              // Legacy API Gateway
              if (
                hostname === 'ksvhvhrxpk.execute-api.us-east-1.amazonaws.com'
              ) {
                decoded.image = `${process.env.NEXT_APP_BASE_URL!}/${pathname}`;
              }
            } catch (err) {
              // Invalid URL fallback image
              decoded.image = `${process.env.NEXT_APP_BASE_URL}/images/c81932f0e6ee783f5c7883a81d4b5b8c`;
            }
            col.push(decoded);
            if (decoded.creator === creator) {
              myCol.push(decoded);
            }
          } catch (error) {
            console.log(error);
          }
        });
        setCollections(col);
        setMyCollections(myCol);
        setCollectionLoading(false);
      })
      .catch(err => console.log('Error decoding collection data ', err));
  }, [name, creator]);
  if (name && creator) {
    // console.log(creator, name);
    const collection = collections.filter(
      col =>
        col.name.toLowerCase() === name.toLowerCase() &&
        col.creator === creator,
    );
    return { collections: collection, myCollections, collectionLoading };
  } else {
    return { collections, myCollections, collectionLoading };
  }
};
