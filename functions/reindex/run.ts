import { ChangeLogItem, runSchema } from "./rpc.types.ts";

import { applyPatch } from "npm:rfc6902";
import { supabase } from "./db.ts";

export async function createRun(item: ChangeLogItem) {
  const run = runSchema.parse(JSON.parse(item.patch));

  const { error } = await supabase
    .from("run")
    .insert([
      run,
    ]);

  if (error) {
    throw error;
  }
}

export async function updateRun(item: ChangeLogItem) {
  const patch = JSON.parse(item.patch);

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
