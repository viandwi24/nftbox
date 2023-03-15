import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { Nftbox } from '@nftbox/contract/target/types/nftbox';
export declare class NftBoxContract {
    program: anchor.Program<Nftbox>;
    wallet: anchor.Wallet;
    provider: anchor.Provider;
    connection: Connection;
    opts: {
        seed: {
            PROGRAM_SEED: string;
            PROGRAM_SEED_PREFIX_BOX: string;
        };
    };
    constructor(w: anchor.Wallet, c: Connection, newIdl?: any);
    findPDABoxSet(authority: PublicKey, name: string): anchor.web3.PublicKey;
    getBoxSetData(pb: PublicKey): Promise<{
        name: string;
        description: string;
        image: string;
        authority: anchor.web3.PublicKey;
        supply: anchor.BN;
        boxCards: anchor.BN;
        state: number;
    } | undefined>;
    getBoxSetAccountCount(): Promise<number>;
}
