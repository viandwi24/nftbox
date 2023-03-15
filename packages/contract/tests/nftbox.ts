import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey, SendTransactionError } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { Nftbox } from "../target/types/nftbox";
import { assert } from "chai";
import { NftBoxContract } from "@nftbox/js"

describe("nftbox", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const wallet = (anchor.getProvider() as any)?.wallet as anchor.Wallet;
  const program = anchor.workspace.Nftbox as Program<Nftbox>;

  const createContract = (w: anchor.Wallet) => {
    return new NftBoxContract(w, program.provider.connection, program.idl)
  }

  it("boxset::create", async () => {
    const contract = createContract(wallet)
    const boxset_name = `Example 3 Nft Random Box (${await contract.getBoxSetAccountCount() + 1})`

    const boxAccount = contract.findPDABoxSet(wallet.publicKey, boxset_name)
    const boxAccountData = await contract.getBoxSetData(boxAccount)
    if (boxAccountData) assert.fail("Box Set already exists")

    const tx = await program.methods
      .createBoxSet(
        boxset_name,
        "get 3 random nfts from the 5 collection in the box",
        "https://picsum.photos/200",
        new anchor.BN(5),
      )
      .accounts({
        authority: wallet.publicKey,
        boxAccount,
      })
      .rpc()

    assert.ok(tx)
  });

  it("boxset::create::error.supply", async () => {
    const contract = createContract(wallet)
    const boxset_name = `Example 3 Nft Random Box (${await contract.getBoxSetAccountCount() + 1})`

    const boxAccount = contract.findPDABoxSet(wallet.publicKey, boxset_name)
    const boxAccountData = await contract.getBoxSetData(boxAccount)
    if (boxAccountData) assert.fail("Box Set already exists")


    try {
      const tx = await program.methods
        .createBoxSet(
          boxset_name,
          "get 3 random nfts from the 5 collection in the box",
          "https://picsum.photos/200",
          new anchor.BN(-0), // <== -1 supply can make error
        )
        .accounts({
          authority: wallet.publicKey,
          boxAccount,
        })
        .rpc()
    } catch (error) {
      assert.equal(error.message, "AnchorError occurred. Error Code: SupplyMustBeGreaterThanZero. Error Number: 6000. Error Message: supply must be greater than 0.")
    }
  });

  it("boxset::create::error.duplicate", async () => {
    const contract = createContract(wallet)
    const boxset_name = `Example 3 Nft Random Box (${await contract.getBoxSetAccountCount()})`

    const boxAccount = contract.findPDABoxSet(wallet.publicKey, boxset_name)

    try {
      const tx = await program.methods
        .createBoxSet(
          boxset_name, // <== this name is already exists, so it will make error
          "get 3 random nfts from the 5 collection in the box",
          "https://picsum.photos/200",
          new anchor.BN(5),
        )
        .accounts({
          authority: wallet.publicKey,
          boxAccount,
        })
        .rpc()
    } catch (error) {
      if (error instanceof SendTransactionError) {
        // must have pattern : Allocate: account Address { address: 8PNf8SfCgveXe6avk6ZFYoEJzgySMJcWpgtQVakfDRYQ, base: None } already in use
        const patternErrorLog = /Allocate: account Address \{ address: ([a-zA-Z0-9]+), base: None \} already in use/
        for (const log of error.logs) {
          if (patternErrorLog.test(log)) {
            return assert.ok(log)
          }
        }
        assert.fail("unexpected error (2): " + error.message)
      } else {
        assert.fail("unexpected error (1): " + error.message)
      }
    }
  });
});
