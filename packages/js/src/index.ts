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
    }
  }

  constructor(w: anchor.Wallet, c: Connection, newIdl?: any) {
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

  async getBoxSetData(pb: PublicKey) {
    try {
      return await this.program.account.boxAccount.fetch(pb)
    } catch (error) {
      return undefined
    }
  }

  async getBoxSetAccountCount() {
    return (await this.program.account.boxAccount.all()).length
  }
}
