import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Nftbox } from "../target/types/nftbox";

describe("nftbox", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Nftbox as Program<Nftbox>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
