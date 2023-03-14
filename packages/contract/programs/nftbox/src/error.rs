use anchor_lang::prelude::*;

#[error_code]
pub enum CreateBoxSetError {
    #[msg("supply must be greater than 0")]
    SupplyMustBeGreaterThanZero,
}