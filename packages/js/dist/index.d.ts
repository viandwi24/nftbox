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
            PROGRAM_SEED_PREFIX_CARD: string;
        };
    };
    constructor(w: anchor.Wallet, c: Connection, newIdl?: any);
    findPDABoxSet(authority: PublicKey, name: string): anchor.web3.PublicKey;
    findPDABoxSetCard(boxset: PublicKey, index: number): anchor.web3.PublicKey;
    getBoxSetCardAccountDataAllByBoxSet(boxset: PublicKey): Promise<anchor.ProgramAccount<{
        name: string;
        description: string;
        image: string;
        authority: anchor.web3.PublicKey;
        maxSupply: anchor.BN;
        supply: anchor.BN;
        boxCards: anchor.BN;
        state: number;
        masterEdition: anchor.web3.PublicKey;
        metadata: anchor.web3.PublicKey;
        tokenAccount: anchor.web3.PublicKey;
        boxSet: anchor.web3.PublicKey;
    }>[] | undefined>;
    getBoxSetCardAccountData(pb: PublicKey): Promise<{
        name: string;
        description: string;
        image: string;
        authority: anchor.web3.PublicKey;
        maxSupply: anchor.BN;
        supply: anchor.BN;
        boxCards: anchor.BN;
        state: number;
        masterEdition: anchor.web3.PublicKey;
        metadata: anchor.web3.PublicKey;
        tokenAccount: anchor.web3.PublicKey;
        boxSet: anchor.web3.PublicKey;
    } | undefined>;
    getBoxSetAccountData(pb: PublicKey): Promise<{
        name: string;
        description: string;
        image: string;
        authority: anchor.web3.PublicKey;
        maxSupply: anchor.BN;
        supply: anchor.BN;
        boxCards: anchor.BN;
        state: number;
        masterEdition: anchor.web3.PublicKey;
        metadata: anchor.web3.PublicKey;
        tokenAccount: anchor.web3.PublicKey;
        boxSet: anchor.web3.PublicKey;
    } | undefined>;
    getBoxSetAccountCount(): Promise<number>;
    getBoxSetAccountAll(): Promise<anchor.ProgramAccount<{
        name: string;
        description: string;
        image: string;
        authority: anchor.web3.PublicKey;
        maxSupply: anchor.BN;
        supply: anchor.BN;
        boxCards: anchor.BN;
        state: number;
        masterEdition: anchor.web3.PublicKey;
        metadata: anchor.web3.PublicKey;
        tokenAccount: anchor.web3.PublicKey;
        boxSet: anchor.web3.PublicKey;
    }>[]>;
    boxset(): NftBoxToolBoxSet;
    card(): NftBoxToolCard;
}
export declare class NftBoxTool {
    contract: NftBoxContract;
    constructor(contract: NftBoxContract);
}
export declare class NftBoxToolBoxSet extends NftBoxTool {
    create(cardOpts: {
        name: string;
        description: string;
        image: string;
        max_supply: number;
    }, voucher: {
        masterEdition: PublicKey;
        metadata: PublicKey;
        tokenAccount: PublicKey;
    }): Promise<{
        boxSet: anchor.web3.PublicKey;
        tx: string;
    }>;
    add_card(boxSetAddress: PublicKey, cards_options: {
        master_edition: PublicKey;
        master_edition_metadata: PublicKey;
        token: PublicKey;
    }): Promise<void>;
}
export declare class NftBoxToolCard extends NftBoxTool {
}
