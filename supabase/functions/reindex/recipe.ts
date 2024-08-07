import { ChangeLogItem, recipeSchema } from "./rpc.types.ts";
import { applyPatch, Patch } from "npm:rfc6902";

import { supabase } from "./db.ts";

export async function createRecipe(item: ChangeLogItem) {
  const recipe = recipeSchema.parse(JSON.parse(item.patch));
  const { error: selectError } = await supabase
    .from("recipe")
    .insert([
      recipe,
    ]);

  if (selectError) {
    throw selectError;
  }
}

export async function updateRecipe(item: ChangeLogItem) {
  const patch: Patch = JSON.parse(item.patch);

  const { data, error: selectError } = await supabase
    .from("recipe")
    .select("*")
    .eq("id", item.id)
    .single();

  if (selectError) {
    throw selectError;
  }

  if (!data) {
    throw new Error("Recipe not found");
  }

  applyPatch(data, patch);

  // Convert created to ISO string
  if ("created" in data && typeof data.created === "number") {
    data.created = new Date(data.created * 1000).toISOString();
  }

  // Update recipe
  const { error: updateError } = await supabase
    .from("recipe")
    .update({
      ...data,
    })
    .eq("id", item.id);

  if (updateError) {
    throw updateError;
  }
}
