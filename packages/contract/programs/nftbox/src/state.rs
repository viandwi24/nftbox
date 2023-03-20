use anchor_lang::prelude::*;

// mistery box account
#[account]
pub struct BoxSetAccount {
    // name of the box
    pub name: String, // 4 + 30
    // description of the box
    pub description: String, // 4 + 256
    // image of the box
    pub image: String, // 4 + 256
    // authority of the box (who can update the box)
    pub authority: Pubkey, // 32
    // max supply of the box (how many box can be opened)
    pub max_supply: u64, // 8
    // supply counter of the box (how many box have been opened)
    pub supply: u64, // 8
    // card master counter
    pub box_cards: u64, // 8
    // state of the box (0: open, 1: closed)
    pub state: u8, // 1
    // voucher master edition
    pub master_edition: Pubkey, // 32
    // voucher metadata
    pub metadata: Pubkey, // 32
    // voucher token account
    pub token_account: Pubkey, // 32
}

// cards on the box account
#[account]
pub struct BoxSetCardAccount {
    // boxset of the card
    pub box_set: Pubkey, // 32
    // master edition of the card
    pub master_edition: Pubkey, // 32
    // master edition metadata of the card
    pub metadata: Pubkey, // 32
    // token account of the card
    pub token_account: Pubkey, // 32
}

#[account]
pub struct VoucherAccount {
    // boxset of the voucher
    pub box_set: Pubkey, // 32
    // master edition of the voucher
    pub master_edition: Pubkey, // 32
    // master edition metadata of the voucher
    pub metadata: Pubkey, // 32
}
