import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { Nftbox } from '@nftbox/contract/target/types/nftbox'
import idl from '@nftbox/contract/target/idl/nftbox.json'

export class NftBoxContract {
  program!: anchor.Program<Nftbox>
  wallet!:  anchor.Wallet
  provider!: anchor.Provider
  connection!: Connection

  opts = {
    seed: {
      PROGRAM_SEED: 'nftbox',
      PROGRAM_SEED_PREFIX_BOX: 'box',
      PROGRAM_SEED_PREFIX_CARD: 'card',
    }
  }

  constructor(w: anchor.Wallet, c: Connection, newIdl?: any) {
    // console.log('args', w, c, newIdl)
    const connection = new Connection(c.rpcEndpoint, 'confirmed')
    const provider = new anchor.AnchorProvider(connection, w, {})
    anchor.setProvider(provider)
    const program = new anchor.Program<Nftbox>((!newIdl ? idl : newIdl) as any, idl?.metadata?.address || '', provider)
    if (!program) throw new Error('Program not found')
    this.program = program
    this.wallet = w
    this.provider = provider
  }

  findPDABoxSet(
    authority: PublicKey,
    name: string,
  ) {
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(this.opts.seed.PROGRAM_SEED),
        Buffer.from(this.opts.seed.PROGRAM_SEED_PREFIX_BOX),
        authority.toBuffer(),
        Buffer.from(name),
      ],
      this.program.programId,
    );
    return pda;
  }

  findPDABoxSetCard(boxset: PublicKey, index: number) {
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(this.opts.seed.PROGRAM_SEED),
        boxset.toBuffer(),
        Buffer.from(this.opts.seed.PROGRAM_SEED_PREFIX_CARD),
        new anchor.BN(index).toArrayLike(Buffer)
      ],
      this.program.programId,
    );
    return pda;
  }

  async getBoxSetCardAccountDataAllByBoxSet(boxset: PublicKey) {
    try {
      return await this.program.account.boxSetCardAccount.all([
        {
          memcmp: {
            offset: 8,
            bytes: boxset.toBase58(),
          }
        }
      ])
    } catch (error) {
      return undefined
    }
  }

  async getBoxSetCardAccountData(pb: PublicKey) {
    try {
      return await this.program.account.boxSetCardAccount.fetch(pb)
    } catch (error) {
      return undefined
    }
  }

  async getBoxSetAccountData(pb: PublicKey) {
    try {
      return await this.program.account.boxSetAccount.fetch(pb)
    } catch (error) {
      return undefined
    }
  }

  async getBoxSetAccountCount() {
    return (await this.program.account.boxSetAccount.all()).length
  }

  async getBoxSetAccountAll() {
    return (await this.program.account.boxSetAccount.all())
  }

  boxset() {
    return new NftBoxToolBoxSet(this)
  }

  card() {
    return new NftBoxToolCard(this)
  }
}

export class NftBoxTool {
  constructor(public contract: NftBoxContract) {}
}

export class NftBoxToolBoxSet extends NftBoxTool {
  async create(
    name: string, description: string, image: string, max_supply: number,
    voucher: {
      masterEdition: PublicKey,
      metadata: PublicKey,
      tokenAccount: PublicKey,
    }
  ) {
    const boxSet = this.contract.findPDABoxSet(this.contract.wallet.publicKey, name)
    const tx = await this.contract.program.methods
      .createBoxSet(
        name,
        description,
        image,
        new anchor.BN(max_supply),
      )
      .accounts({
        authority: this.contract.wallet.publicKey,
        boxSet,
        masterEdition: voucher.masterEdition,
        metadata: voucher.metadata,
        tokenAccount: voucher.tokenAccount,
      })
      .rpc()
    return {
      boxSet,
      tx,
    }
  }

  async add_card(
    boxSetAddress: PublicKey,
    cards_options: {
      master_edition: PublicKey,
      master_edition_metadata: PublicKey,
      token: PublicKey,
    }
  ) {
    const boxset = await this.contract.getBoxSetAccountData(boxSetAddress)
    if (!boxset) throw new Error('Boxset not found')

    const currentBoxCardLengts = boxset.boxCards.toNumber()
    const index = currentBoxCardLengts + 1
    console.log('currentBoxCardLengts', currentBoxCardLengts)

    const cardAddress = this.contract.findPDABoxSetCard(boxSetAddress, index)
    const card = await this.contract.getBoxSetCardAccountData(cardAddress)
    if (card) throw new Error('Card Index already exists')

    const tx = await this.contract.program.methods
      .addCardToBoxSet(new anchor.BN(index))
      .accounts({
        card: cardAddress,
        boxSet: boxSetAddress,
        authority: this.contract.wallet.publicKey,

        // nft
        masterEdition: cards_options.master_edition,
        metadata: cards_options.master_edition_metadata,
        tokenAccount: cards_options.token,
      })
      .rpc()
    console.log('tx', tx)
  }
}

export class NftBoxToolCard extends NftBoxTool {
}
