import { ChangeLogItem, runSchema } from "./rpc.types.ts";
import { applyPatch, Patch } from "npm:rfc6902";

import { supabase } from "./db.ts";

export async function createRun(item: ChangeLogItem) {
  const run = runSchema.parse(JSON.parse(item.patch));

  const { error: selectError } = await supabase
    .from("run")
    .insert([
      run,
    ]);

  if (selectError) {
    throw selectError;
  }
}

export async function updateRun(item: ChangeLogItem) {
  const patch: Patch = JSON.parse(item.patch);

  const { data, error: selectError } = await supabase
    .from("run")
    .select("*")
    .eq("id", item.id)
    .single();

  if (selectError) {
    throw selectError;
  }

  if (!data) {
    throw new Error("Run not found");
  }

  applyPatch(data, patch);

  // Convert created to ISO string
  if ("created" in data && typeof data.created === "number") {
    data.created = new Date(data.created * 1000).toISOString();
  }

  // Update run
  const { error: updateError } = await supabase
    .from("run")
    .update({
      ...data,
    })
    .eq("id", item.id);

  if (updateError) {
    throw updateError;
  }
}
