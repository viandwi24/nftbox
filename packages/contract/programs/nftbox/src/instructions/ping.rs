use {
    anchor_lang::{
        prelude::*,
    },
};

pub fn ping(ctx: Context<PingContext>, msg: String) -> Result<()> {
    msg!("pong from nftbox program : program address {}", ctx.program_id);
    msg!("pong from nftbox program : msg {}", msg);
    Ok(())
}

#[derive(Accounts)]
pub struct PingContext {}