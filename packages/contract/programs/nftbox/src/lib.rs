use {
    anchor_lang::prelude::*,
    instructions::*,
    instructions::{
        PingContext,
        CreateBoxSetContext,
        AddCardToBoxSetContext,
    },
};

pub mod instructions;
pub mod state;
pub mod constant;
pub mod error;
pub mod utils;

declare_id!("D4YkZGgDuoWUeasNPY6prAWXk129YUL9xXXhw7K2wPCR");

#[program]
pub mod nftbox {
    use super::*;

    pub fn ping(ctx: Context<PingContext>, msg: String) -> Result<()> {
        return instructions::ping(ctx, msg)
    }

    pub fn create_box_set(
        ctx: Context<CreateBoxSetContext>,
        name: String,
        description: String,
        image: String,
        max_supply: u64,
    ) -> Result<()> {
        return instructions::create_box_set(
            ctx,
            name,
            description,
            image,
            max_supply,
        )
    }

    pub fn add_card_to_box_set(
        ctx: Context<AddCardToBoxSetContext>,
        index: u64,
    ) -> Result<()> {
        return instructions::add_card_to_box_set(
            ctx,
            index,
        )
    }
}
