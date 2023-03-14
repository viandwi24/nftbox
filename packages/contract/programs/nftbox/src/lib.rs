use anchor_lang::prelude::*;

declare_id!("4CJB5XECQadXrKebw3LFRstheFPEN7cCQvjHYcXStgLJ");

#[program]
pub mod nftbox {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive]
