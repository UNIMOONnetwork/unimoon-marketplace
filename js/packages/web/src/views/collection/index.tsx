import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  IMetadataExtension,
  useConnection,
  ParsedAccount,
  Metadata,
  toPublicKey,
  decodeMetadata,
  Attribute,
} from '@oyster/common';
import { useCollections } from '../../hooks';
import { AuctionView, AuctionViewState, useAuctions } from '../../hooks';

export const CollectionView = () => {
  const { name, creator } = useParams<{ name: string; creator: string }>();
  const connection = useConnection();
  const { collections: collection } = useCollections(creator, name);
  console.log(collection);
  const { auctionByMetadata } = useAuctions();

  // const [filteredAuctions, setFilteredAuctions] = useState<Array<AuctionView>>(
  //   [],
  // );
  // const [itemMetadata, setItemMetadata] = useState<
  //   Map<string, IMetadataExtension | undefined>
  // >(new Map());
  // // const [colAttributes, setColAttributes] = useState({});
  // // const [colAttributes, setColAttributes] = useState<Attribute[]>([]);
  // const [filteredNFTs, setFilteredNFTs] = useState<
  //   Array<ParsedAccount<Metadata>>
  // >([]);

  const auctionsByCollection = useMemo(() => {
    const itemsOnAuctions: Array<AuctionView> = [];
    if (collection[0] && collection[0].members.length > 0) {
      for (let meta of collection[0].members) {
        let auc = auctionByMetadata.get(meta);
        if (auc && !auc.auction.info.ended()) {
          itemsOnAuctions.push(auc);
        }
      }
      return itemsOnAuctions;
    } else {
      return [];
    }
  }, [collection[0], auctionByMetadata.size]);

  const nftsByCollection = useMemo(() => {
    if (filteredNFTs.length === 0) {
      let result: Array<ParsedAccount<Metadata>> = [];
      // let attributes = {};
      if (collection[0]) {
          try {
            const auc = auctionByMetadata.get(i);
            if (!auc || auc.auction.info.ended()) {
              connection
                .getAccountInfo(toPublicKey(i), 'confirmed')
                .then(async accountInfo => {
                  if (accountInfo) {
                    try {
                      const parsedAccount: ParsedAccount<Metadata> = {
                        pubkey: i,
                        account: accountInfo,
                        info: decodeMetadata(accountInfo.data),
                      };
                      result.push(parsedAccount);
                    } catch (error) {}
                  }
                });
            }
          } catch (error) {}
        }
      }
      // setColAttributes(attributes);
      setFilteredNFTs(result);
      return result;
    }
    return [];
  }, [collection[0], auctionByMetadata.size, itemMetadata.size]);


  useEffect(() => {
    if (auctionsByCollection) {
      setFilteredAuctions(auctionsByCollection);
    }
  }, [auctionsByCollection]);

  return <>{/* <ArtworksContentView /> */}</>;
};
