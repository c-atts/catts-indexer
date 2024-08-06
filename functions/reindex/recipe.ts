import { ChangeLogItem, recipeSchema } from "./rpc.types.ts";

import { supabase } from "./db.ts";

export async function createRecipe(item: ChangeLogItem) {
  const recipe = recipeSchema.parse(JSON.parse(item.patch));
  const { selectError } = await supabase
    .from("recipe")
    .insert([
      recipe,
    ]);

  if (selectError) {
    throw selectError;
  }
}
