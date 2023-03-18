"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const _1 = require("./");
(async () => {
    const $contract = new _1.NftBoxContract(undefined, new web3_js_1.Connection('https://api.devnet.solana.com'));
    const boxsets = await $contract.getBoxSetAccountAll();
    const bs = boxsets.find(n => n.account.boxCards.toNumber() > 0);
    if (!bs)
        return;
    const cards = await $contract.getBoxSetCardAccountDataAllByBoxSet(bs.publicKey);
    console.log('cards', cards);
})();
//# sourceMappingURL=test.js.map