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
