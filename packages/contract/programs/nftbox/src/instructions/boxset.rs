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
        },
        utils::{
            assert_signer,
        }
    },
};

pub fn create_box_set(
    ctx: Context<CreateBoxSetContext>,
    name: String,
    description: String,
    image: String,
    max_supply: u64,
) -> Result<()> {
    // log
    msg!("[nftbox] Create box with name: {}", name);
    msg!("[nftbox] description: {}", description);
    msg!("[nftbox] image: {}", image);
    msg!("[nftbox] max_supply: {}", max_supply);

    // validate box account data
    if max_supply <= 0 {
        return Err(CreateBoxSetError::SupplyMustBeGreaterThanZero.into());
    }

    // authority must signer
    assert_signer(&ctx.accounts.authority.to_account_info())?;

    // create box account
    let box_set = &mut ctx.accounts.box_set;
    box_set.name = name;
    box_set.description = description;
    box_set.image = image;
    box_set.authority = ctx.accounts.authority.key();
    box_set.max_supply = max_supply;
    box_set.supply = 0;
    box_set.box_cards = 0;
    box_set.state = 0;

    // log
    msg!("[nftbox] Box account created successfully with address: {} | {}", box_set.key(), box_set.to_account_info().key());

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
        space = 8 + (4 + 30) + (4 + 256) + (4 + 256) + 32 + 8 + 8 + 8 + 1,
        seeds = [
            PROGRAM_SEED.as_bytes(),
            PROGRAM_SEED_PREFIX_BOX.as_bytes(),
            authority.key().as_ref(),
            name.as_ref(),
        ],
        bump,
    )]
    pub box_set: Account<'info, BoxSetAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
