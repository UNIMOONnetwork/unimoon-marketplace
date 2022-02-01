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
import classNames from 'classnames';
import { AuctionView, AuctionViewState, useAuctions } from '../../hooks';
import { ArtContent } from '../../components/ArtContent';
import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import { useCollections } from '../../hooks';
import BN from 'bn.js';

export enum ExploreView {
  Column = 'column',
  Module = 'module',
}

export const CollectionView = () => {
  const { name, creator } = useParams<{ name: string; creator: string }>();
  const connection = useConnection();
  const { collections: collection } = useCollections(creator, name);
  const { auctionByMetadata } = useAuctions();

  const [filteredAuctions, setFilteredAuctions] = useState<Array<AuctionView>>(
    [],
  );
  const [itemMetadata, setItemMetadata] = useState<
    Map<string, IMetadataExtension | undefined>
  >(new Map());
  // const [colAttributes, setColAttributes] = useState({});
  // const [colAttributes, setColAttributes] = useState<Attribute[]>([]);
  const [filteredNFTs, setFilteredNFTs] = useState<
    Array<ParsedAccount<Metadata>>
  >([]);

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
        for (let i of collection[0].members) {
          // let meta = metadata.find(meta => meta.pubkey === i);
          // if (meta) {
          //   console.log('dsdsds');
          //   const auc = auctionByMetadata.get(meta.pubkey);
          //   if (!auc || auc.auction.info.ended()) {
          //     result.push(meta);
          //   }
          // } else {

          // }
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

  // const notListedNFTs = useMemo(() => {
  //   // console.log(filteredNFTs);
  //   return filteredNFTs.filter(nItem => !auctionByMetadata.get(nItem.pubkey));
  // }, [auctionByMetadata, filteredNFTs]);
  // console.log(notListedNFTs);

  const searchAction = e => {
    const val = e.target.value;
    // setSearch(val);

    if (val === '') {
      // setFilteredAuctions(auctionsByCollection);
      setFilteredNFTs(nftsByCollection);
    } else {
      // const filteredAuctions = auctionsByCollection.filter(item =>
      //   item.thumbnail.metadata.info.data.name.toLowerCase().includes(val),
      // );
      // setFilteredAuctions(filteredAuctions);

      const filteredNFTs = nftsByCollection.filter(item =>
        item.info.data.name.toLowerCase().includes(val),
      );
      setFilteredNFTs(filteredNFTs);
    }
  };

  useEffect(() => {
    if (auctionsByCollection) {
      setFilteredAuctions(auctionsByCollection);
    }
  }, [auctionsByCollection]);

  return (
    <>
      <div className="content">
        <div className={`view`}>
          {filteredAuctions &&
            filteredAuctions.map((auction, index) => (
              <Link
                to={`/auction/${auction.auction.pubkey.toString()}`}
                key={index}
                style={{ display: 'table-cell' }}
              >
                <AuctionRenderCard key={index} auctionView={auction} />
              </Link>
            ))}
          {filteredNFTs &&
            filteredNFTs.map((nItem, index) => (
              <Card className="art-card" key={index}>
                <Link to={`/token/${nItem.pubkey}`}>
                  <ArtContent
                    className="auction-image no-events"
                    preview={false}
                    uri={itemMetadata.get(nItem.pubkey)?.image || ''}
                    allowMeshRender={false}
                  />
                  <div className="meta">{nItem.info.data.name}</div>
                  <img
                    src={itemMetadata.get(nItem.pubkey)?.image || ''}
                    className="nft-image"
                  />
                </Link>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};
