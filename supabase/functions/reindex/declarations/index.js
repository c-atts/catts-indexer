import { Actor, HttpAgent } from "npm:@dfinity/agent";

// Imports and re-exports candid interface
import { idlFactory } from "./catts_engine.did.js";

export { idlFactory } from "./catts_engine.did.js";

export const canisterId = Deno.env.get("CANISTER_ID_CATTS_ENGINE");

export const createActor = (canisterId, options = {}) => {
  options = { ...options, verifyQuerySignatures: false };

  if (Deno.env.get("DFX_NETWORK") === "local") {
    options = {
      ...options,
      shouldFetchRootKey: true,
      host: "http://host.docker.internal:4943",
    };
  }

  const agent = HttpAgent.createSync(options);

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

export const catts_engine = canisterId ? createActor(canisterId) : undefined;
