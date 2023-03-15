use {
    anchor_lang::{
        prelude::*,
    },
    crate::{
        constant::{
            PROGRAM_SEED,
            PROGRAM_SEED_PREFIX_BOX,
        },
        state::{
            BoxSetCardAccount,
        },
        error::{
            CreateBoxSetError,
        }
    },
};

pub fn add_card_to_box_set(
    ctx: Context<AddCardToBoxSetContext>,
    name: String,
    description: String,
    image: String,
    supply: u64,
) -> Result<()> {

}

pub struct AddCardToBoxSetContext<'info> {
    /// CHECK: We're about to create this with Anchor
    #[account(
        init,
        payer = user,
        space = 8 + (4 + 30) + (4 + 256) + (4 + 256) + 32 + 8 + 8 + 1,
        seeds = [
            PROGRAM_SEED.as_bytes(),
            PROGRAM_SEED_PREFIX_BOX.as_bytes(),
            authority.key().as_ref(),
            name.as_ref(),
        ],
        bump,
    )]
    pub box_set_account: Account<'info, BoxSetAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
