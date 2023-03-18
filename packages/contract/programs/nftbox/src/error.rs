use anchor_lang::prelude::*;

#[error_code]
pub enum CreateBoxSetError {
    #[msg("supply must be greater than 0")]
    SupplyMustBeGreaterThanZero,
}

#[error_code]
pub enum AddCardToBoxSetError {
    #[msg("token owner must be same with authority")]
    TokenOwnerMustSameAsAuthority,
    #[msg("token mint must be same with master edition key")]
    TokenMintMustSameWithMasterEdition,
    #[msg("token must be have amount")]
    TokenMustBeHaveAmount,
    #[msg("invalid master edition account data")]
    InvalidMasterEditionAccountData,
    #[msg("card index must be same with box cards count")]
    IndexMustBeSameWithBoxCardsCount,
}
