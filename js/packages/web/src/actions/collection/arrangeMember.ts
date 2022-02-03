import {
  programIds,
  sendTransactionWithRetry,
  toPublicKey,
  WalletSigner,
} from '@oyster/common';
import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { COLLECTION_SCHEMA } from './schema';
import { serialize } from 'borsh';

export class ArrangeMemberArgs {
  instruction: number = 3;
  oldIndex: number;
  newIndex: number;

  constructor(args: { oldIndex: number; newIndex: number }) {
    this.oldIndex = args.oldIndex;
    this.newIndex = args.newIndex;
  }
}

export const arrangeMember = async (
  connection: Connection,
  wallet: WalletSigner | undefined,
  collectionKey: PublicKey,
  oldIndex: number,
  newIndex: number,
) => {
  if (!wallet?.publicKey) return;
  const instructions: TransactionInstruction[] = [];

  await appendArrangeMemberInstruction(
    wallet,
    collectionKey,
    oldIndex,
    newIndex,
    instructions,
  );

  await sendTransactionWithRetry(connection, wallet, instructions, []);
};

export async function appendArrangeMemberInstruction(
  wallet: WalletSigner,
  collectionKey: PublicKey,
  oldIndex: number,
  newIndex: number,
  instructions: TransactionInstruction[],
) {
  if (wallet.publicKey) {
    const txnData = Buffer.from(
      serialize(
        COLLECTION_SCHEMA,
        new ArrangeMemberArgs({ oldIndex, newIndex }),
      ),
    );

    const keys = [
      {
        pubkey: collectionKey,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: wallet.publicKey,
        isSigner: true,
        isWritable: false,
      },
    ];

    instructions.push(
      new TransactionInstruction({
        keys,
        programId: toPublicKey(programIds().collection),
        data: txnData,
      }),
    );
  }
}
