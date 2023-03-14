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
            BoxAccount,
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
    let box_account = &mut ctx.accounts.box_account;
    box_account.name = name;
    box_account.description = description;
    box_account.image = image;
    box_account.authority = ctx.accounts.authority.key();
    box_account.supply = supply;
    box_account.box_cards = 0;
    box_account.state = 0;
    
    msg!("[nftbox] Box account created successfully with address: {} | {}", box_account.key(), box_account.to_account_info().key());

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
    pub box_account: Account<'info, BoxAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}