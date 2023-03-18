use {
    anchor_lang::{
        prelude::*,
    },
    mpl_token_metadata::{
        ID as TOKEN_METADATA_PROGRAM_ID,
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
    spl_token:: {
        ID as SPL_TOKEN_PROGRAM_ID,
    },
    crate::{
        state::{
            BoxSetAccount,
            BoxSetCardAccount,
        },
        utils::{
            assert_signer,
            assert_owned_by,
            assert_account_key,
            find_master_edition,
        },
        constant::{
            PROGRAM_SEED,
            PROGRAM_SEED_PREFIX_CARD,
        },
        error::{
            AddCardToBoxSetError,
        }
    },
};

pub fn add_card_to_box_set(
    ctx: Context<AddCardToBoxSetContext>,
    index: u64,
) -> Result<()> {

    // log
    msg!("[nftbox] Unpack box set : {}", ctx.accounts.box_set.key());
    msg!("[nftbox] Add card to box set with index: {}", index);

    // box set must owned by program
    assert_owned_by(&ctx.accounts.box_set.to_account_info(), &ctx.program_id)?;

    // token account must owned by spl token program
    assert_owned_by(&ctx.accounts.token_account.to_account_info(), &SPL_TOKEN_PROGRAM_ID)?;

    // master edition must owned by token metadata program
    assert_owned_by(&ctx.accounts.master_edition.to_account_info(), &TOKEN_METADATA_PROGRAM_ID)?;

    // metadata must owned by token metadata program
    assert_owned_by(&ctx.accounts.metadata.to_account_info(), &TOKEN_METADATA_PROGRAM_ID)?;

    // authority must signer
    assert_signer(&ctx.accounts.authority.to_account_info())?;

    // box set authority must same as current authority
    assert_account_key(&ctx.accounts.authority.to_account_info(), &ctx.accounts.box_set.authority)?;

    // token owner must same as current authority
    if ctx.accounts.token_account.owner != *ctx.accounts.authority.key {
        return Err(AddCardToBoxSetError::TokenOwnerMustSameAsAuthority.into());
    }

    // master edition address must be edition
    let mint = ctx.accounts.token_account.mint;
    let (master_edition_address, _) = find_master_edition(&mint);
    if master_edition_address != *ctx.accounts.master_edition.to_account_info().key {
        return Err(AddCardToBoxSetError::InvalidMasterEditionAccountData.into());
    }

    // token must be have amount
    if ctx.accounts.token_account.amount < 1 {
        return Err(AddCardToBoxSetError::TokenMustBeHaveAmount.into());
    }

    // validate card index
    // index must be greater than last box cards count
    if ctx.accounts.box_set.box_cards < index && ctx.accounts.box_set.box_cards > index {
        return Err(AddCardToBoxSetError::IndexMustBeSameWithBoxCardsCount.into());
    }

    // log
    msg!("[ids] spl token program id: {}", SPL_TOKEN_PROGRAM_ID);
    msg!("[ids] token metadata program id: {}", TOKEN_METADATA_PROGRAM_ID);
    msg!("[authority] key {:?}", ctx.accounts.authority.key);
    msg!("[token] amount {:?}", ctx.accounts.token_account.amount);
    msg!("[token] delegated_amount {:?}", ctx.accounts.token_account.delegated_amount);
    msg!("[token] mint {:?}", ctx.accounts.token_account.mint);
    msg!("[token] owner {:?}", ctx.accounts.token_account.owner);
    msg!("[token] state {:?}", ctx.accounts.token_account.state);
    msg!("[master_edition] owner {:?}", ctx.accounts.master_edition.to_account_info().owner);
    msg!("[master_edition] key {:?}", ctx.accounts.master_edition.to_account_info().key);
    msg!("[master_edition] [unpack] key {:?}", ctx.accounts.master_edition.key);
    msg!("[master_edition] [unpack] amount {:?}", ctx.accounts.master_edition.supply);
    msg!("[master_edition] [unpack] max_supply {:?}", ctx.accounts.master_edition.max_supply);
    msg!("[metadata] owner {:?}", ctx.accounts.metadata.to_account_info().owner);
    msg!("[metadata] key {:?}", *ctx.accounts.metadata.to_account_info().key);
    msg!("[metadata] [unpack] mint {:?}", ctx.accounts.metadata.mint);
    msg!("[metadata] [unpack] collection {:?}", ctx.accounts.metadata.collection);
    msg!("[metadata] [unpack] collection_details {:?}", ctx.accounts.metadata.collection_details);
    msg!("[metadata] [unpack] edition_nonce {:?}", ctx.accounts.metadata.edition_nonce);
    msg!("[metadata] [unpack] token_standard {:?}", ctx.accounts.metadata.token_standard);
    msg!("[metadata] [unpack] update_authority {:?}", ctx.accounts.metadata.update_authority);

    // create card account
    let card = &mut ctx.accounts.card;
    card.box_set = ctx.accounts.box_set.key();
    card.token_account = *ctx.accounts.token_account.to_account_info().key;
    card.master_edition = *ctx.accounts.master_edition.to_account_info().key;
    card.metadata = *ctx.accounts.metadata.to_account_info().key;

    // increament box set card count
    let boxset = &mut ctx.accounts.box_set;
    boxset.box_cards += 1;

    Ok(())
}

#[derive(Accounts)]
#[instruction(index: u64)]
pub struct AddCardToBoxSetContext<'info> {
    /// CHECK: We're about to create this with Anchor
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 32 + 32,
        seeds = [
            PROGRAM_SEED.as_bytes(),
            box_set.key().as_ref(),
            PROGRAM_SEED_PREFIX_CARD.as_bytes(),
            &[(index as u64).try_into().unwrap()],
        ],
        bump,
    )]
    pub card: Account<'info, BoxSetCardAccount>,
    #[account(mut)]
    pub box_set: Account<'info, BoxSetAccount>,

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
    pub authority: Signer<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
