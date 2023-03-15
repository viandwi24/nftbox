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
            BoxSetAccount,
        },
        error::{
            CreateBoxSetError,
        }
    },
};

pub fn create_box_set(
    ctx: Context<CreateBoxSetContext>,
    name: String,
    description: String,
    image: String,
    supply: u64,
) -> Result<()> {

    msg!("[nftbox] Create box with name: {}", name);
    msg!("[nftbox] description: {}", description);
    msg!("[nftbox] image: {}", image);
    msg!("[nftbox] supply: {}", supply);

    // validate box account data
    if supply <= 0 {
        return Err(CreateBoxSetError::SupplyMustBeGreaterThanZero.into());
    }

    // create box account
    let box_set_account = &mut ctx.accounts.box_set_account;
    box_set_account.name = name;
    box_set_account.description = description;
    box_set_account.image = image;
    box_set_account.authority = ctx.accounts.authority.key();
    box_set_account.supply = supply;
    box_set_account.box_cards = 0;
    box_set_account.state = 0;

    msg!("[nftbox] Box account created successfully with address: {} | {}", box_set_account.key(), box_set_account.to_account_info().key());

    // ok
    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String, description: String, image: String, supply: u64)]
pub struct CreateBoxSetContext<'info> {
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
