"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftBoxToolCard = exports.NftBoxToolBoxSet = exports.NftBoxTool = exports.NftBoxContract = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const web3_js_1 = require("@solana/web3.js");
const nftbox_json_1 = __importDefault(require("@nftbox/contract/target/idl/nftbox.json"));
class NftBoxContract {
    program;
    wallet;
    provider;
    connection;
    opts = {
        seed: {
            PROGRAM_SEED: 'nftbox',
            PROGRAM_SEED_PREFIX_BOX: 'box',
            PROGRAM_SEED_PREFIX_CARD: 'card',
        }
    };
    constructor(w, c, newIdl) {
        const connection = new web3_js_1.Connection(c.rpcEndpoint, 'confirmed');
        const provider = new anchor.AnchorProvider(connection, w, {});
        anchor.setProvider(provider);
        const program = new anchor.Program((!newIdl ? nftbox_json_1.default : newIdl), nftbox_json_1.default?.metadata?.address || '', provider);
        if (!program)
            throw new Error('Program not found');
        this.program = program;
        this.wallet = w;
        this.provider = provider;
    }
    findPDABoxSet(authority, name) {
        const [pda] = anchor.web3.PublicKey.findProgramAddressSync([
            Buffer.from(this.opts.seed.PROGRAM_SEED),
            Buffer.from(this.opts.seed.PROGRAM_SEED_PREFIX_BOX),
            authority.toBuffer(),
            Buffer.from(name),
        ], this.program.programId);
        return pda;
    }
    findPDABoxSetCard(boxset, index) {
        const [pda] = anchor.web3.PublicKey.findProgramAddressSync([
            Buffer.from(this.opts.seed.PROGRAM_SEED),
            boxset.toBuffer(),
            Buffer.from(this.opts.seed.PROGRAM_SEED_PREFIX_CARD),
            new anchor.BN(index).toArrayLike(Buffer)
        ], this.program.programId);
        return pda;
    }
    async getBoxSetCardAccountDataAllByBoxSet(boxset) {
        try {
            return await this.program.account.boxSetCardAccount.all([
                {
                    memcmp: {
                        offset: 8,
                        bytes: boxset.toBase58(),
                    }
                }
            ]);
        }
        catch (error) {
            return undefined;
        }
    }
    async getBoxSetCardAccountData(pb) {
        try {
            return await this.program.account.boxSetCardAccount.fetch(pb);
        }
        catch (error) {
            return undefined;
        }
    }
    async getBoxSetAccountData(pb) {
        try {
            return await this.program.account.boxSetAccount.fetch(pb);
        }
        catch (error) {
            return undefined;
        }
    }
    async getBoxSetAccountCount() {
        return (await this.program.account.boxSetAccount.all()).length;
    }
    async getBoxSetAccountAll() {
        return (await this.program.account.boxSetAccount.all());
    }
    boxset() {
        return new NftBoxToolBoxSet(this);
    }
    card() {
        return new NftBoxToolCard(this);
    }
}
exports.NftBoxContract = NftBoxContract;
class NftBoxTool {
    contract;
    constructor(contract) {
        this.contract = contract;
    }
}
exports.NftBoxTool = NftBoxTool;
class NftBoxToolBoxSet extends NftBoxTool {
    async create(name, description, image, max_supply, voucher) {
        const boxSet = this.contract.findPDABoxSet(this.contract.wallet.publicKey, name);
        const tx = await this.contract.program.methods
            .createBoxSet(name, description, image, new anchor.BN(max_supply))
            .accounts({
            authority: this.contract.wallet.publicKey,
            boxSet,
            masterEdition: voucher.masterEdition,
            metadata: voucher.metadata,
            tokenAccount: voucher.tokenAccount,
        })
            .rpc();
        return {
            boxSet,
            tx,
        };
    }
    async add_card(boxSetAddress, cards_options) {
        const boxset = await this.contract.getBoxSetAccountData(boxSetAddress);
        if (!boxset)
            throw new Error('Boxset not found');
        const currentBoxCardLengts = boxset.boxCards.toNumber();
        const index = currentBoxCardLengts + 1;
        console.log('currentBoxCardLengts', currentBoxCardLengts);
        const cardAddress = this.contract.findPDABoxSetCard(boxSetAddress, index);
        const card = await this.contract.getBoxSetCardAccountData(cardAddress);
        if (card)
            throw new Error('Card Index already exists');
        const tx = await this.contract.program.methods
            .addCardToBoxSet(new anchor.BN(index))
            .accounts({
            card: cardAddress,
            boxSet: boxSetAddress,
            authority: this.contract.wallet.publicKey,
            masterEdition: cards_options.master_edition,
            metadata: cards_options.master_edition_metadata,
            tokenAccount: cards_options.token,
        })
            .rpc();
        console.log('tx', tx);
    }
}
exports.NftBoxToolBoxSet = NftBoxToolBoxSet;
class NftBoxToolCard extends NftBoxTool {
}
exports.NftBoxToolCard = NftBoxToolCard;
//# sourceMappingURL=index.js.map