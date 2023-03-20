use {
    anchor_lang::{
        prelude::*,
    },
    anchor_spl:: {
        token:: {
            TokenAccount,
        },
        metadata::{
            MasterEditionAccount,
            MetadataAccount,
        }
    },
    mpl_token_metadata::{
        ID as TOKEN_METADATA_PROGRAM_ID,
    },
    spl_token:: {
        ID as SPL_TOKEN_PROGRAM_ID,
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
            AddCardToBoxSetError,
        },
        utils::{
            assert_signer,
            assert_owned_by,
            find_master_edition,
        },
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

    // validate params
    // validate box account data
    if max_supply <= 0 {
        return Err(CreateBoxSetError::SupplyMustBeGreaterThanZero.into());
    }

    // validate voucher nft
    let nft_master_edition = &ctx.accounts.master_edition;
    let nft_metadata = &ctx.accounts.metadata;
    let nft_token_account = &ctx.accounts.token_account;
    // token account must owned by spl token program
    assert_owned_by(&ctx.accounts.token_account.to_account_info(), &SPL_TOKEN_PROGRAM_ID)?;
    // master edition must owned by token metadata program
    assert_owned_by(&ctx.accounts.master_edition.to_account_info(), &TOKEN_METADATA_PROGRAM_ID)?;
    // metadata must owned by token metadata program
    assert_owned_by(&ctx.accounts.metadata.to_account_info(), &TOKEN_METADATA_PROGRAM_ID)?;
    // token owner must same as current authority
    if nft_token_account.owner != *ctx.accounts.authority.key {
        return Err(AddCardToBoxSetError::TokenOwnerMustSameAsAuthority.into());
    }
    // master edition address must be edition
    let mint = nft_token_account.mint;
    let (master_edition_address, _) = find_master_edition(&mint);
    if master_edition_address != nft_master_edition.key() {
        return Err(AddCardToBoxSetError::InvalidMasterEditionAccountData.into());
    }
    // token must be have amount
    if nft_token_account.amount < 1 {
        return Err(AddCardToBoxSetError::TokenMustBeHaveAmount.into());
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
    box_set.master_edition = nft_master_edition.key();
    box_set.metadata = nft_metadata.key();
    box_set.token_account = nft_token_account.key();

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
        space = 8 + (4 + 30) + (4 + 256) + (4 + 256) + 32 + 8 + 8 + 8 + 1 + 32 + 32 + 32,
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

    /// CHECK: Metaplex will check this
    #[account()]
    pub master_edition: Account<'info, MasterEditionAccount>,
    /// CHECK: Metaplex will check this
    #[account(mut)]
    pub metadata: Account<'info, MetadataAccount>,
    /// CHECK: Metaplex will check this
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
