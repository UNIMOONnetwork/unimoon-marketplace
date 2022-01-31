export interface Auction {
  name: string;
  auctionerName: string;
  auctionerLink: string;
  highestBid: number;
  solAmt: number;
  link: string;
  image: string;
}

export interface Artist {
  address?: string;
  name: string;
  link: string;
  image: string;
  itemsAvailable?: number;
  itemsSold?: number;
  about?: string;
  verified?: boolean;
  background?: string;
  share?: number;
}

export enum ArtType {
  Master,
  Print,
  NFT,
}
export interface Art {
  uri: string | undefined;
  mint: string | undefined;
  link: string;
  title: string;
  artist: string;
  seller_fee_basis_points?: number;
  creators?: Artist[];
  type: ArtType;
  edition?: number;
  supply?: number;
  maxSupply?: number;
}

export interface Presale {
  targetPricePerShare?: number;
  pricePerShare?: number;
  marketCap?: number;
}

export interface ICollection {
  keys: Array<string>;
  name: string;
  symbol: string;
  description: string;
  cost: string;
  ownerId: string;
  short_url: string;
  banner_url: string;
  likes: string;
  properties: Array<{ [key: string]: string }>;
  _id: string;
  expirationTime: string;
  imageUrl: string;
  collectionId: string;
  createdAt: Date;
}

export interface ICollectionData {
  name: string;
  description: string;
  image: string;
  creator: StringPublicKey;
  authorities: StringPublicKey[];
  advanced: number;
  max_size: number;
  members: StringPublicKey[];
  member_of: CollectionSignature[];
  pubkey?: StringPublicKey;
}

export interface HistoryData {
  item: string;
  history: {
    price: number;
    from: string;
    to: string;
    saleType: string;
    type: string;
    createdAt?: string;
  };
}

export interface ITopTradeWallet {
  rank?: number;
  address: string;
  count: number;
  totalVolume: number;
}

export interface INFTTxDetail {
  price: number;
  type: string;
  date: string;
  nft: string;
}
