use {
    anchor_lang::prelude::*,
    instructions::*,
    instructions::{
        PingContext,
        CreateBoxSetContext,
    },
};

pub mod instructions;
pub mod state;
pub mod constant;
pub mod error;

declare_id!("2R4MEs4jN1vU22HSThywX5hy3RW5VPPavUseVgGFQ3Kc");

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
        supply: u64,
    ) -> Result<()> {
        return instructions::create_box_set(
            ctx,
            name,
            description,
            image,
            supply,
        )
    }
}
