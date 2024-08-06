import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { ChangeLogResponse, changeLogResponseSchema } from "./rpc.types.ts";
import { createRun, updateRun } from "./run.ts";

import { catts_engine } from "./declarations/index.js";
import { createRecipe } from "./recipe.ts";
import { getNextLogIndex } from "./change-log.ts";
import { supabase } from "./db.ts";

Deno.serve(async (_) => {
  if (!catts_engine) {
    return new Response("catts_engine not initialized", { status: 500 });
  }

  const nextLogIndex = await getNextLogIndex();

  const res: ChangeLogResponse = changeLogResponseSchema.parse(
    await catts_engine?.change_log(nextLogIndex, []),
  );

  if ("Err" in res) {
    return new Response(JSON.stringify(res.Err), { status: 500 });
  }

  // Sort by index, oldest first
  const indexedChangeLogItems = res.Ok.data.sort((a, b) => a.index - b.index);

  for (const indexedItem of indexedChangeLogItems) {
    try {
      switch (indexedItem.item.action) {
        case "Create":
          switch (indexedItem.item.type_name) {
            case "Recipe":
              await createRecipe(indexedItem.item);
              break;
            case "Run":
              await createRun(indexedItem.item);
              break;
          }
          break;
        case "Update":
          switch (indexedItem.item.type_name) {
            case "Run":
              await updateRun(indexedItem.item);
              break;
          }
          break;
        case "Delete":
          break;
      }
      const { selectError } = await supabase
        .from("change_log_tracker")
        .update({
          latest_change_log_id: indexedItem.index,
          last_updated: new Date().toISOString(),
        })
        .eq("id", 1);
      if (selectError) {
        throw selectError;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return new Response(
    JSON.stringify(
      res,
      (_, value) => typeof value === "bigint" ? value.toString() : value,
    ),
    { headers: { "Content-Type": "application/json" } },
  );
});
