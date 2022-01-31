import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Grid,
  Card,
  Input,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  ButtonGroup,
  IconButton,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
} from '@material-ui/core';
import {
  IMetadataExtension,
  useConnection,
  ParsedAccount,
  Metadata,
  toPublicKey,
  decodeMetadata,
  Attribute,
} from '@oyster/common';
import {
  Twitter,
  Telegram,
  Instagram,
  ViewColumn,
  ViewModule,
  ExpandMore,
  ArrowBack,
  ArrowForward,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import {
  AuctionView,
  AuctionViewState,
  getExtendedArt,
  useAuctions,
} from '../../hooks';
import { Header } from '../../components/Header';
import { ArtContent } from '../../components/ArtContent';
import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import { CreatorComponent } from '../../views/auctionView/components/creator';
import { useCollections } from '../../hooks';
import BN from 'bn.js';
import { LiveAuctionViewState } from '../exploreView/auctionList';

export enum ExploreView {
  Column = 'column',
  Module = 'module',
}

const sortOption = [
  { value: 'desc-price', label: 'Sort by Price high to low' },
  { value: 'asc-price', label: 'Sort by Price low to high' },
];

const CategoryCard = (props: any) => {
  const { item, selected, onSelect } = props;

  return (
    <div
      className={classNames('category-card', { selected: !!selected })}
      onClick={() => onSelect(item.value)}
    >
      {item.label}
    </div>
  );
};

const CategoryItems = (props: any) => {
  const { items, selected, onChange } = props;

  return (
    <Grid container spacing={1} className="category-items">
      {items.map((item: any, index: number) => (
        <Grid item key={index} xs={12} md={6}>
          <CategoryCard
            key={index}
            item={item}
            selected={selected === item.value}
            onSelect={onChange}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export const Filter = (props: any) => {
  return (
    <Select
      onChange={props.change}
      value={props.value}
      style={{ marginRight: 25 }}
    >
      {props.options.map((item, index) => (
        <MenuItem value={item.value} key={index}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  );
};

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  filterTitle: {
    fontFamily: 'suisse-intl-trial',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '18px',
    letterSpacing: '0.05em',
  },
  root: {
    boxShadow: 'none',
    padding: 0,
  },
}));

const CustomAccordion = styled(props => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: '0px',
  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const CustomAccordionSummary = styled(props => (
  <AccordionSummary expandIcon={<ExpandMore />} {...props} />
))(({ theme }) => ({
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
    '&.Mui-expanded': {
      margin: 0,
    },
  },
}));

const CustomAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export const CollectionView = () => {
  const classes = useStyles();
  const { name, creator } = useParams<{ name: string; creator: string }>();
  // const { metadata } = useMeta();
  // const wallet = useWallet();
  // const { connected } = wallet;
  const connection = useConnection();
  const { collections: collection } = useCollections(creator, name);
  const { auctionByMetadata } = useAuctions();
  // console.log(auctionByMetadata);
  // const [showPreModal, setShowPreModal] = useState(false);
  // const [showFinalModal, setShowFinalModal] = useState(false);
  // const [showMintingModal, setShowMintingModal] = useState(false);
  // const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [coverFile, setCoverFile] = useState<File | undefined>(undefined);
  // const [mainFile, setMainFile] = useState<File | undefined>(undefined);
  // const [isNFTImage, setIsNFTImage] = useState<boolean>(true);
  // const [previewImage, setPreviewImage] = useState<string>('');
  // const [mintCost, setMintCost] = useState<number>(0);
  // const [attributes, setAttributes] = useState<IMetadataExtension>({
  //   name: '',
  //   symbol: '',
  //   description: '',
  //   external_url: '',
  //   image: '',
  //   animation_url: undefined,
  //   seller_fee_basis_points: 0,
  //   creators: [],
  //   properties: {
  //     files: [],
  //     category: MetadataCategory.Image,
  //     maxSupply: 1,
  //   },
  // });

  const [filteredAuctions, setFilteredAuctions] = useState<Array<AuctionView>>(
    [],
  );
  const [itemMetadata, setItemMetadata] = useState<
    Map<string, IMetadataExtension | undefined>
  >(new Map());
  const [colAttributes, setColAttributes] = useState({});
  // const [colAttributes, setColAttributes] = useState<Attribute[]>([]);
  const [filteredNFTs, setFilteredNFTs] = useState<
    Array<ParsedAccount<Metadata>>
  >([]);

  // const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc-price');
  const [view, setView] = useState<ExploreView>(ExploreView.Column);
  const [filter, setFilter] = useState<LiveAuctionViewState>(
    LiveAuctionViewState.All,
  );
  const [open, setOpen] = useState<boolean>(true);

  // const collection = collections.find(item => item.short_url == id);

  const viewModes = [
    { value: ExploreView.Column, icon: <ViewColumn /> },
    { value: ExploreView.Module, icon: <ViewModule /> },
  ];

  const status = [
    { value: LiveAuctionViewState.All, label: 'All' },
    { value: LiveAuctionViewState.BuyNow, label: 'Buy Now' },
    { value: LiveAuctionViewState.Dutch, label: 'Dutch Auction' },
    { value: LiveAuctionViewState.English, label: 'English Auction' },
    { value: LiveAuctionViewState.Ended, label: 'Ended Auction' },
  ];

  // const auctionsByCollection = useMemo(() => {
  //   let result = auctions.filter(aItem =>
  //     collection[0]?.members.includes(aItem.thumbnail.metadata.pubkey),
  //   );

  //   setFilteredAuctions(result);

  //   return result;
  // }, [auctions, collection[0]]);

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
  }, [collection[0], auctionByMetadata.size, filter]);

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
                      await getExtendedArt({
                        uri: parsedAccount.info.data.uri,
                      }).then(data => {
                        setColAttributes(data?.attributes || []);
                        // data?.attributes?.forEach(item => {
                        //   let trait: string = item.trait_type as string;
                        //   if (
                        //     attributes[trait] &&
                        //     attributes[trait][item.value]
                        //   ) {
                        //     attributes[trait][item.value]++;
                        //   } else {
                        //     attributes[trait] = {
                        //       ...(attributes[trait] || {}),
                        //       [item.value]: 1,
                        //     };
                        //   }
                        // });
                        setItemMetadata(itemMetadata.set(i, data));
                      });
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
    const filteredAuctions = getAuctions(filter);
    if (filteredAuctions) {
      setFilteredAuctions(filteredAuctions);
    }
  }, [filter, auctionsByCollection]);

  useEffect(() => {
    filteredAuctions.sort((auctionA, auctionB) => {
      if (
        auctionA.isInstantSale &&
        auctionB.isInstantSale &&
        auctionA.auctionDataExtended &&
        auctionA.auctionDataExtended.info &&
        auctionA.auctionDataExtended.info.instantSalePrice &&
        auctionB.auctionDataExtended &&
        auctionB.auctionDataExtended.info &&
        auctionB.auctionDataExtended.info.instantSalePrice
      ) {
        if (sort === 'desc-price') {
          return auctionA.auctionDataExtended?.info.instantSalePrice.gte(
            auctionB.auctionDataExtended?.info.instantSalePrice,
          )
            ? 1
            : -1;
        } else {
          return auctionA.auctionDataExtended?.info.instantSalePrice.lt(
            auctionB.auctionDataExtended?.info.instantSalePrice,
          )
            ? -1
            : 1;
        }
      } else if (
        auctionA.isInstantSale &&
        !auctionB.isInstantSale &&
        auctionA.auctionDataExtended &&
        auctionA.auctionDataExtended.info &&
        auctionA.auctionDataExtended.info.instantSalePrice &&
        auctionB.auction.info.priceFloor.minPrice
      ) {
        if (sort === 'desc-price') {
          return auctionA.auctionDataExtended?.info.instantSalePrice.gte(
            new BN(auctionB.auction.info.priceFloor.minPrice?.toNumber()),
          )
            ? 1
            : -1;
        } else {
          return auctionA.auctionDataExtended?.info.instantSalePrice.lt(
            new BN(auctionB.auction.info.priceFloor.minPrice?.toNumber()),
          )
            ? -1
            : 1;
        }
      } else if (
        !auctionA.isInstantSale &&
        auctionB.isInstantSale &&
        auctionB.auctionDataExtended &&
        auctionB.auctionDataExtended.info &&
        auctionB.auctionDataExtended.info.instantSalePrice &&
        auctionA.auction.info.priceFloor.minPrice
      ) {
        if (sort === 'desc-price') {
          return auctionB.auctionDataExtended?.info.instantSalePrice.gte(
            new BN(auctionA.auction.info.priceFloor.minPrice?.toNumber()),
          )
            ? 1
            : -1;
        } else {
          return auctionB.auctionDataExtended?.info.instantSalePrice.lt(
            new BN(auctionA.auction.info.priceFloor.minPrice?.toNumber()),
          )
            ? -1
            : 1;
        }
      }
      return 0;
    });
  }, [sort]);

  function getAuctions(val: string) {
    switch (val) {
      case LiveAuctionViewState.All:
        return auctionsByCollection;
      case LiveAuctionViewState.Ended:
        return auctionsByCollection.filter(
          auction =>
            auction.state == AuctionViewState.Ended ||
            auction.state == AuctionViewState.BuyNow,
        );
      case LiveAuctionViewState.BuyNow:
        return auctionsByCollection.filter(
          auction =>
            auction.state == AuctionViewState.Ended && auction.isInstantSale,
        );
      case LiveAuctionViewState.Dutch:
        return auctionsByCollection.filter(
          auction =>
            auction.state != AuctionViewState.Ended && auction.isDutchAuction,
        );
      case LiveAuctionViewState.English:
        return auctionsByCollection.filter(
          auction =>
            auction.state != AuctionViewState.Ended &&
            !auction.isInstantSale &&
            !auction.isDutchAuction,
        );
      default:
        return auctionsByCollection;
    }
  }

  // const getMintCost = () => {
  //   let files: File[] = [];
  //   if (mainFile) {
  //     files.push(mainFile);
  //   }
  //   if (coverFile) {
  //     files.push(coverFile);
  //   }
  //   const rentCall = Promise.all([
  //     connection.getMinimumBalanceForRentExemption(MintLayout.span),
  //     connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
  //   ]);
  //   if (files.length) {
  //     getAssetCostToStore([
  //       ...files,
  //       new File([JSON.stringify(attributes)], 'metadata.json'),
  //     ]).then(async lamports => {
  //       const sol = lamports / LAMPORT_MULTIPLIER;

  //       // TODO: cache this and batch in one call
  //       const [mintRent, metadataRent] = await rentCall;

  //       const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER;

  //       // TODO: add fees based on number of transactions and signers
  //       setMintCost(sol + additionalSol);
  //     });
  //   }
  // };

  //---- mint method
  // const mint = async () => {
  //   let inte: any;
  //   if (attributes.creators?.length === 0) {
  //     if (wallet?.publicKey) {
  //       const key = wallet.publicKey.toString();
  //       setAttributes({
  //         ...attributes,
  //         creators: [
  //           new Creator({
  //             address: new PublicKey(key).toString(),
  //             verified: true,
  //             share: 100,
  //           }),
  //         ],
  //       });
  //     }
  //   }
  //   try {
  //     setShowFinalModal(false);
  //     setShowMintingModal(true);
  //     let files: File[] = [];
  //     if (mainFile) {
  //       files.push(mainFile);
  //     }
  //     if (coverFile) {
  //       files.push(coverFile);
  //     }
  //     let uris: MetadataFile[] = [];
  //     const filesLength = attributes.properties.files?.length || 0;
  //     if (filesLength <= 0 && (mainFile || coverFile)) {
  //       uris = [coverFile, mainFile]
  //         .filter(f => f)
  //         .map(f => {
  //           const uri = typeof f === 'string' ? f : f?.name || '';
  //           const type =
  //             typeof f === 'string' || !f
  //               ? 'unknown'
  //               : f.type || getLast(f.name.split('.')) || 'unknown';

  //           return {
  //             uri,
  //             type,
  //           } as MetadataFile;
  //         });
  //     }
  //     const metadata = {
  //       name: attributes.name,
  //       symbol: attributes.symbol,
  //       creators: attributes.creators,
  //       description: attributes.description,
  //       sellerFeeBasisPoints: attributes.seller_fee_basis_points,
  //       image:
  //         attributes.image ||
  //         (isNFTImage ? mainFile?.name : coverFile?.name) ||
  //         '',
  //       animation_url: attributes.animation_url || (mainFile && mainFile.name),
  //       external_url: attributes.external_url,
  //       properties: {
  //         files: filesLength > 0 ? attributes.properties.files : uris,
  //         category: attributes.properties?.category,
  //       },
  //       attributes: attributes.attributes || [],
  //       collection: attributes.collection || undefined,
  //     };
  //     // const _nft = await mintNFT(
  //     //   connection,
  //     //   wallet,
  //     //   endpoint.name,
  //     //   files,
  //     //   metadata,
  //     //   setNFTcreateProgress,
  //     //   attributes.properties?.maxSupply,
  //     // );
  //     // if (_nft) {
  //     //   update();
  //     //   setNft(_nft);
  //     //   saveItemInCollection(productId, _nft.metadataAccount);
  //     //   setShowMintingModal(false);
  //     //   setShowSuccessModal(true);
  //     // }
  //     clearInterval(inte);
  //   } catch (error) {
  //     console.error(error);
  //     clearInterval(inte);
  //     setShowMintingModal(false);
  //     setShowNotification(true);
  //   }
  // };

  // const showModalFinalModal = () => {
  //   getMintCost();
  //   setShowFinalModal(true);
  // };

  // const handleCancelFinalModal = () => {
  //   setShowFinalModal(false);
  // };

  // const handleCancelPreModal = () => {
  //   setShowPreModal(false);
  // };

  // const getBase64 = (file: File | undefined) => {
  //   // TODO: Alert the user upon file read error
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       setPreviewImage(reader.result as string);
  //     };
  //     reader.onerror = () => {
  //       setPreviewImage('');
  //     };
  //   } else {
  //     setPreviewImage('');
  //   }
  // };

  // const previewComponent = useMemo(() => {
  //   getBase64(isNFTImage ? mainFile : coverFile);
  //   return (
  //     <>
  //       <Grid container justifyContent="center">
  //         <Grid item>
  //           <div className="mulish-bold-black-14px">Preview</div>
  //         </Grid>
  //       </Grid>
  //       <Grid
  //         container
  //         style={{ marginBottom: '10px' }}
  //         justifyContent="center"
  //       >
  //         {mainFile ? (
  //           <img
  //             width={300}
  //             height={300}
  //             src={previewImage}
  //             style={{ cursor: 'zoom-in' }}
  //             onClick={() => setPreviewOpen(true)}
  //           />
  //         ) : (
  //           <img
  //             width={300}
  //             height={300}
  //             src={fallbackImage}
  //             style={{ cursor: 'zoom-in' }}
  //             onClick={() => setPreviewOpen(true)}
  //           />
  //         )}
  //       </Grid>
  //       <Grid
  //         container
  //         style={{ marginBottom: '10px' }}
  //         justifyContent="center"
  //       >
  //         <div className="item-name-text">
  //           {attributes.name || 'No name set'}
  //         </div>
  //       </Grid>
  //       <Grid
  //         container
  //         style={{ marginBottom: '10px' }}
  //         justifyContent="center"
  //       >
  //         <div className="auction-text">
  //           Auction | 1 of {attributes.properties.maxSupply}
  //         </div>
  //       </Grid>
  //       <Grid
  //         container
  //         style={{ marginBottom: '10px' }}
  //         justifyContent="center"
  //       >
  //         <div className="auction-text">No bid yet</div>
  //       </Grid>
  //       <Grid
  //         container
  //         style={{ marginBottom: '10px' }}
  //         justifyContent="center"
  //       >
  //         <Typography
  //           paragraph={true}
  //           className="mulish-normal-quick-silver-14px"
  //         >
  //           {attributes.description || 'No description provided'}
  //         </Typography>
  //       </Grid>
  //       <Divider />
  //       <Grid container style={{ marginTop: 20 }} justifyContent="center">
  //         <Button
  //           onClick={showModalFinalModal}
  //           className="button button1-theme"
  //           disabled={!connected || !mainFile || !attributes.name}
  //           fullWidth
  //         >
  //           {connected ? 'Create Item' : 'Connect to wallet'}
  //         </Button>
  //       </Grid>
  //     </>
  //   );
  // }, [
  //   mainFile,
  //   coverFile,
  //   previewImage,
  //   attributes.name,
  //   attributes.description,
  //   attributes.seller_fee_basis_points,
  //   attributes.properties.maxSupply,
  // ]);

  return (
    <>
      <Header isGoBack />
      {collection[0] && (
        <Grid container className="collection-view">
          <Grid item xs={12} className="item">
            <div className="logo">
              <img className="logo" src={collection[0]?.image || ''} />
            </div>
            <div className="content">
              {/* <div className="launch">
                <div><div></div></div>
                <Typography variant="h6" className="mulish-bold-black-24px">
                  Launch Live
                </Typography>
              </div> */}
              <div
                className="valign-text-middle gt-normal-black"
                style={{ fontSize: 32, marginTop: 30 }}
              >
                {collection[0]?.name}
              </div>
              <Typography
                className="suisse-normal-grey"
                style={{ fontSize: 14, marginTop: 10 }}
              >
                {collection[0]?.description}
              </Typography>
              {/* <div className="social-icons">
                <div className="item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 45 45"
                    fill="none"
                  >
                    <circle cx="22.5" cy="22.5" r="22.5" fill="black" />
                    <rect x="9" y="12" width="28" height="20" rx="5" fill="white" />
                    <rect x="12" y="18" width="14" height="5" fill="black" />
                    <rect x="12" y="24" width="14" height="5" fill="black" />
                    <rect x="28" y="18" width="6" height="11" fill="black" />
                  </svg>
                </div>
                <div className="item">
                  <Twitter className="icon" />
                </div>
                <div className="item">
                  <Telegram className="icon" />
                </div>
                <div className="item">
                  <Instagram className="icon" />
                </div>
              </div>
              <div style={{display: 'flex', marginTop: 24}}>
                <div className="mint-btn">Mint</div>
                <Typography className="desc">
                  Mint Cost: .1 SOL
                </Typography>
              </div>
              <div className="info valign-text-middle">
                <div className="item">
                  <div className="mulish-normal-sonic-silver-12px">Items</div>
                  <Typography variant="h6" className="mulish-bold-black-24px">
                    10.0K
                  </Typography>
                </div>
                <div className="item">
                  <div className="mulish-normal-sonic-silver-12px">Owner</div>
                  <Typography variant="h6" className="mulish-bold-black-24px">
                    3.1K
                  </Typography>
                </div>
                <div className="item">
                  <div className="mulish-normal-sonic-silver-12px">Floor price</div>
                  <Typography variant="h6" className="mulish-bold-black-24px">
                    ----
                  </Typography>
                </div>
                <div className="item">
                  <div className="mulish-normal-sonic-silver-12px">
                    Volumn traded
                  </div>
                  <div style={{ display: 'flex' }}>
                    <img
                      src="img/eth.png"
                      style={{ height: 24, marginTop: 3, width: 24 }}
                    />
                    <Typography variant="h6" className="mulish-bold-black-24px">
                      400.8K
                    </Typography>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="creator">
              <CreatorComponent address={collection[0].creator} label="" />
            </div>
          </Grid>
          <Grid item xs={12} style={{ marginBottom: 40 }}>
            <Grid container>
              <Grid item>
                <div className={classNames(['sidebar', { collapsed: !open }])}>
                  <FormControl
                    variant="outlined"
                    className={classNames(classes.formControl, 'view-mode')}
                  >
                    {open && (
                      <ButtonGroup variant="text">
                        {viewModes.map((item, index) => (
                          <IconButton
                            key={index}
                            color={
                              view === item.value ? 'secondary' : 'default'
                            }
                            onClick={() => setView(item.value)}
                          >
                            {item.icon}
                          </IconButton>
                        ))}
                      </ButtonGroup>
                    )}
                    <IconButton color="primary" onClick={() => setOpen(!open)}>
                      {open ? <ArrowBack /> : <ArrowForward />}
                    </IconButton>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={classNames([classes.formControl, 'search'])}
                  >
                    <Input
                      placeholder="Search..."
                      style={{ width: '100%' }}
                      onChange={searchAction}
                    />
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="sort" className={classes.filterTitle}>
                      Sort
                    </InputLabel>
                    <Select
                      labelId="sortt"
                      id="sort"
                      label="Sort"
                      onChange={e => setSort(`${e.target.value}`)}
                      value={sort}
                    >
                      {sortOption.map((item, index) => (
                        <MenuItem value={item.value} key={index}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {Object.keys(colAttributes).length > 0 && (
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      {Object.keys(colAttributes)?.map(attrib => {
                        return (
                          <CustomAccordion>
                            <CustomAccordionSummary
                              aria-controls="panel-content"
                              id="panel-header"
                            >
                              <div className="mulish-semi-bold-black-16px">
                                {attrib}
                              </div>
                            </CustomAccordionSummary>
                            <CustomAccordionDetails>
                              <Grid container spacing={1}>
                                {Object.keys(colAttributes[attrib]).map(
                                  item => (
                                    <>
                                      <Grid item xs={10}>
                                        <div className="suisse-italic-normal-grey f14">
                                          {item}
                                        </div>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={2}
                                        style={{ textAlign: 'right' }}
                                      >
                                        <div className="suisse-normal-grey f14">
                                          {colAttributes[attrib][item]}
                                        </div>
                                      </Grid>
                                    </>
                                  ),
                                )}
                              </Grid>
                            </CustomAccordionDetails>
                          </CustomAccordion>
                        );
                      })}
                    </FormControl>
                  )}
                  {/* {colAttributes?.map(attrib => {
                    return (
                      <CustomAccordion>
                        <CustomAccordionSummary
                          aria-controls="panel-content"
                          id="panel-header"
                        >
                          <div className="mulish-semi-bold-black-16px">
                            {attrib.trait_type}
                          </div>
                        </CustomAccordionSummary>
                        <CustomAccordionDetails>
                          <div className="mulish-black-14px"> No Attribute </div>
                        </CustomAccordionDetails>
                      </CustomAccordion>
                    );
                  })} */}
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <Accordion className={classes.root}>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel-content"
                        id="panel-header"
                        className={classes.root}
                      >
                        <div className="mulish-semi-bold-black-16px">
                          Status
                        </div>
                      </AccordionSummary>
                      <AccordionDetails className={classes.root}>
                        <CategoryItems
                          items={status}
                          selected={filter}
                          onChange={setFilter}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </FormControl>
                </div>
              </Grid>
              <Grid item style={{ flex: '1' }}>
                <div className="content">
                  <div className={`view ${view}`}>
                    {filteredAuctions &&
                      filteredAuctions.map((auction, index) => (
                        <Link
                          to={`/auction/${auction.auction.pubkey.toString()}`}
                          key={index}
                          style={{ display: 'table-cell' }}
                        >
                          <AuctionRenderCard
                            key={index}
                            auctionView={auction}
                          />
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
                            <div className="meta">
                              <Typography variant="h6" className="meta-title">
                                {nItem.info.data.name}
                              </Typography>
                            </div>
                            <img
                              src={itemMetadata.get(nItem.pubkey)?.image || ''}
                              className="nft-image"
                            />
                          </Link>
                        </Card>
                      ))}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};
