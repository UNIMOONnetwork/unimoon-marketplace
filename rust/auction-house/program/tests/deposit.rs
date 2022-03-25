#![cfg(feature = "test-bpf")]
mod utils;
use mpl_testing_utils::solana::{airdrop};
use mpl_testing_utils::utils::Metadata;
use solana_program_test::*;
use solana_sdk::{signature::Keypair, signer::Signer};
use std::assert_eq;
use utils::setup_functions::*;

#[tokio::test]
async fn deposit_success() {
    let mut context = auction_house_program_test().start_with_context().await;
    // Payer Wallet
    let (ah, ahkey,_) = existing_auction_house_test_context(&mut context)
        .await
        .unwrap();
    let test_metadata = Metadata::new();
    airdrop(&mut context, &test_metadata.token.pubkey(), 10_000_000_000).await.unwrap();
    test_metadata
        .create(
            &mut context,
            "Test".to_string(),
            "TST".to_string(),
            "uri".to_string(),
            None,
            10,
            false,
        )
        .await
        .unwrap();
    let buyer = Keypair::new();
    airdrop(&mut context, &buyer.pubkey(), 10_000_000_000).await.unwrap();
    let (acc, deposit_tx) = deposit(&mut context, &ahkey, &ah, &test_metadata, &buyer, 1);
    context.banks_client.process_transaction(deposit_tx).await.unwrap();
    let sts = context
        .banks_client
        .get_account(acc.escrow_payment_account)
        .await
        .expect("Error Getting Trade State")
        .expect("Trade State Empty");
    assert_eq!(sts.lamports, 1);
}
