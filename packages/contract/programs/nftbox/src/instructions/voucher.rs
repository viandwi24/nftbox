use {
    anchor_lang::{
        prelude::*,
    },
    anchor_spl:: {
        token:: {
            TokenAccount,
        },
        metadata::{
            MetadataAccount,
        }
    },
    crate::{
        state::{
            BoxSetAccount,
        },
    },
};

pub fn add_voucher_to_pack(_ctx: Context<AddVoucherToPackContext>) -> Result<()> {
    // ok
    Ok(())
}

#[derive(Accounts)]
pub struct AddVoucherToPackContext<'info> {
    #[account(mut)]
    pub box_set: Account<'info, BoxSetAccount>,

    #[account(mut)]
    pub voucher_owner: Signer<'info>,
    #[account(mut)]
    pub auhtority: Signer<'info>,

    /// CHECK: Metaplex will check this
    #[account(mut)]
    pub master_edition: AccountInfo<'info>,
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
