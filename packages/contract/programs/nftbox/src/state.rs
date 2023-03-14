use anchor_lang::prelude::*;

// mistery box account
// fields : name, description, image, authority, supply, box_cards, state
#[account]
pub struct BoxAccount {
    // name of the box
    pub name: String, // 4 + 30
    // description of the box
    pub description: String, // 4 + 256
    // image of the box
    pub image: String, // 4 + 256
    // authority of the box (who can update the box)
    pub authority: Pubkey, // 32
    // supply of the box (how many box can be opened)
    pub supply: u64, // 8
    // card master counter
    pub box_cards: u64, // 8
    // state of the box (0: open, 1: closed)
    pub state: u8, // 1
}