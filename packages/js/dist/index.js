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
exports.NftBoxContract = void 0;
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
    async getBoxSetData(pb) {
        try {
            return await this.program.account.boxAccount.fetch(pb);
        }
        catch (error) {
            return undefined;
        }
    }
    async getBoxSetAccountCount() {
        return (await this.program.account.boxAccount.all()).length;
    }
}
exports.NftBoxContract = NftBoxContract;
//# sourceMappingURL=index.js.map