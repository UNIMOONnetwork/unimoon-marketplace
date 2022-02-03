import {
  findProgramAddress,
  programIds,
  StringPublicKey,
  toPublicKey,
  WalletSigner,
} from '@oyster/common';
import {
  COLLECTION_PREFIX,
  COLLECTION_SCHEMA,
  CollectionSignature,
} from './schema';
import {
  Connection,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import { serialize } from 'borsh';

export class CreateCollectionArgs {
  instruction: number = 0;
  name: string;
  description: string;
  image: string;
  advanced: number;
  maxSize: number;
  members: StringPublicKey[];
  memberOf: CollectionSignature[];

  constructor(args: {
    name: string;
    description: string;
    image: string;
    advanced: number;
    maxSize: number;
    members: StringPublicKey[];
    memberOf: CollectionSignature[];
  }) {
    this.name = args.name;
    this.description = args.description;
    this.image = args.image;
    this.advanced = args.advanced;
    this.maxSize = args.maxSize;
    this.members = args.members;
    this.memberOf = args.memberOf;
  }
}

export const mintCollection = async (
  connection: Connection,
  wallet: WalletSigner | undefined,
  collection: {
    name: string;
    description: string;
    image: string;
    removable: boolean;
    arrangeable: boolean;
    expandable: boolean;
    maxSize: number;
    members: StringPublicKey[];
    memberOf: CollectionSignature[];
  },
  creatorKey: StringPublicKey,
): Promise<{
  collectionAccount: StringPublicKey;
} | void> => {
  if (!wallet?.publicKey) return;

  const payerPublicKey = wallet.publicKey.toBase58();
  const instructions: TransactionInstruction[] = [];

  const collectionAccount = await createCollection(
    collection.name,
    collection.description,
    collection.image,
    collection.removable,
    collection.arrangeable,
    collection.expandable,
    collection.maxSize,
    collection.members,
    collection.memberOf,
    creatorKey,
    instructions,
    payerPublicKey,
  );

  return { collectionAccount };
};

async function createCollection(
  name: string,
  description: string,
  image: string,
  removable: boolean,
  expandable: boolean,
  arrangeable: boolean,
  maxSize: number,
  members: StringPublicKey[],
  memberOf: CollectionSignature[],
  creatorKey: StringPublicKey,
  instructions: TransactionInstruction[],
  payer: StringPublicKey,
) {
  const collectionProgramId = programIds().collection;

  const collectionAccount = (
    await findProgramAddress(
      [
        Buffer.from(COLLECTION_PREFIX),
        toPublicKey(collectionProgramId).toBuffer(),
        toPublicKey(creatorKey).toBuffer(),
        Buffer.from(name),
      ],
      toPublicKey(collectionProgramId),
    )
  )[0];

  let advanced = 0;
  if (removable) {
    advanced += 1;
  }
  if (expandable) {
    advanced += 2;
  }
  if (arrangeable) {
    advanced += 4;
  }
  const value = new CreateCollectionArgs({
    name,
    description,
    image,
    advanced,
    maxSize,
    members,
    memberOf,
  });

  const txnData = Buffer.from(serialize(COLLECTION_SCHEMA, value));

  const keys = [
    {
      pubkey: toPublicKey(collectionAccount),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(creatorKey),
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(payer),
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
  ];

  instructions.push(
    new TransactionInstruction({
      keys,
      programId: toPublicKey(collectionProgramId),
      data: txnData,
    }),
  );

  return collectionAccount;
}
