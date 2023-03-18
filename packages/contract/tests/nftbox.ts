import * as anchor from "@project-serum/anchor";
import { Connection, Keypair, PublicKey, SendTransactionError } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { Nftbox } from "../target/types/nftbox";
import { assert } from "chai";
import { NftBoxContract } from "@nftbox/js"

// types
type RunTest = (wallet: anchor.Wallet, createContract: (w: anchor.Wallet) => NftBoxContract) => void

// utils
const generateBoxSetName = async (contract: NftBoxContract) => `Example 3 Nft Random Box (${await contract.getBoxSetAccountCount() + 1})`

// tests
const runBoxSetTest: RunTest = (wallet, createContract) => {
  it("boxset::create", async () => {
    const contract = createContract(wallet)
    const boxset_name = `Example 3 Nft Random Box (${await contract.getBoxSetAccountCount() + 1})`

    const boxAccount = contract.findPDABoxSet(wallet.publicKey, boxset_name)
    const boxAccountData = await contract.getBoxSetAccountData(boxAccount)
    if (boxAccountData) assert.fail("Box Set already exists")

    const tx = await contract.program.methods
      .createBoxSet(
        boxset_name,
        "get 3 random nfts from the 5 collection in the box",
        "https://picsum.photos/200",
        new anchor.BN(5),
      )
      .accounts({
        authority: wallet.publicKey,
        boxSet: boxAccount,
      })
      .rpc()

    assert.ok(tx)
  });

  it("boxset::create::error.authority_not_signer", async () => {
    const contract = createContract(wallet)
    const boxset_name = `Example 3 Nft Random Box (${await contract.getBoxSetAccountCount() + 1})`

    const boxAccount = contract.findPDABoxSet(wallet.publicKey, boxset_name)
    const boxAccountData = await contract.getBoxSetAccountData(boxAccount)
    if (boxAccountData) assert.fail("Box Set already exists")


    try {
      const generatedWallet = Keypair.generate()
      const tx = await contract.program.methods
        .createBoxSet(
          boxset_name,
          "get 3 random nfts from the 5 collection in the box",
          "https://picsum.photos/200",
          new anchor.BN(5),
        )
        .accounts({
          authority: generatedWallet.publicKey, // <== authority is not signer so it will make error
          boxSet: boxAccount,
        })
        .rpc()
    } catch (error) {
      assert.equal(error.message, "Signature verification failed")
    }
  });

  it("boxset::create::error.supply_must_greater_than_0", async () => {
    const contract = createContract(wallet)
    const boxset_name = `Example 3 Nft Random Box (${await contract.getBoxSetAccountCount() + 1})`

    const boxAccount = contract.findPDABoxSet(wallet.publicKey, boxset_name)
    const boxAccountData = await contract.getBoxSetAccountData(boxAccount)
    if (boxAccountData) assert.fail("Box Set already exists")


    try {
      const tx = await contract.program.methods
        .createBoxSet(
          boxset_name,
          "get 3 random nfts from the 5 collection in the box",
          "https://picsum.photos/200",
          new anchor.BN(-0), // <== -1 supply can make error
        )
        .accounts({
          authority: wallet.publicKey,
          boxSet: boxAccount,
        })
        .rpc()
    } catch (error) {
      assert.equal(error.message, "AnchorError occurred. Error Code: SupplyMustBeGreaterThanZero. Error Number: 6000. Error Message: supply must be greater than 0.")
    }
  });

  it("boxset::create::error.duplicate_box_name", async () => {
    const contract = createContract(wallet)
    const boxset_name = `Example 3 Nft Random Box (${await contract.getBoxSetAccountCount()})`

    const boxAccount = contract.findPDABoxSet(wallet.publicKey, boxset_name)

    try {
      const tx = await contract.program.methods
        .createBoxSet(
          boxset_name, // <== this name is already exists, so it will make error
          "get 3 random nfts from the 5 collection in the box",
          "https://picsum.photos/200",
          new anchor.BN(5),
        )
        .accounts({
          authority: wallet.publicKey,
          boxSet: boxAccount,
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
}

const runBoxSetCardTest: RunTest = (wallet, createContract) => {
  it("card::add_to_boxset", async () => {
    const contract = createContract(wallet)

    // create box set first
    // const boxSetCreated = await contract.boxset().create(
    //   await generateBoxSetName(contract),
    //   'get 3 random nfts from the 5 collection in the box',
    //   'https://picsum.photos/200',
    //   5
    // )

    // add card to box set
    await contract.boxset().add_card(
      // boxSetCreated.boxSet,
      new PublicKey('BnUjnq6fTrYPRyYQw8J1x7Wm9DazzZho9o3acTaZU9zK'),
      {
        master_edition: new PublicKey('7YBKsLYMqfarTEur4hf2f2w6HnnxDSHV822TVw5t35Nu'),
        master_edition_metadata: new PublicKey('E16TENdrNbmqrr4d7UJiTcJfQASXy8FT3GMMz2ucuz95'),
        token: new PublicKey('GYaVdQZubCqkzYCFrvTn1VyyMhEyD63XNjVf6hpVCn1U'),
      }
    )
  })
}

describe("nftbox", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // setups
  const wallet = (anchor.getProvider() as any)?.wallet as anchor.Wallet;
  const program = anchor.workspace.Nftbox as Program<Nftbox>;
  const createContract = (w: anchor.Wallet) => {
    return new NftBoxContract(w, program.provider.connection, program.idl)
  }


  // run tests suite
  // runBoxSetTest(wallet, createContract)
  runBoxSetCardTest(wallet, createContract)
});
