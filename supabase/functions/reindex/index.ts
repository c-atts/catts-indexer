import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { ChangeLogResponse, changeLogResponseSchema } from "./rpc.types.ts";
import { createRecipe, deleteRecipe, updateRecipe } from "./recipe.ts";
import { createRun, updateRun } from "./run.ts";

import { catts_engine } from "./declarations/index.js";
import { getNextLogIndex } from "./change-log.ts";
import { supabase } from "./db.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (_) => {
  if (!catts_engine) {
    return new Response("catts_engine not initialized", { status: 500 });
  }

  const nextLogIndex = await getNextLogIndex();

  const res: ChangeLogResponse = changeLogResponseSchema.parse(
    await catts_engine?.change_log(nextLogIndex, []),
  );

  if ("Err" in res) {
    return new Response(JSON.stringify(res.Err), {
      status: 500,
      headers: corsHeaders,
    });
  }

  // Sort by index, oldest first
  const logItems = res.Ok.data.sort((a, b) => a.index - b.index);

  for (const logItem of logItems) {
    try {
      switch (logItem.data.action) {
        case "Create":
          switch (logItem.data.type_name) {
            case "Recipe":
              await createRecipe(logItem.data);
              break;
            case "Run":
              await createRun(logItem.data);
              break;
          }
          break;
        case "Update":
          switch (logItem.data.type_name) {
            case "Recipe":
              await updateRecipe(logItem.data);
              break;
            case "Run":
              await updateRun(logItem.data);
              break;
          }
          break;
        case "Delete":
          switch (logItem.data.type_name) {
            case "Recipe":
              await deleteRecipe(logItem.data);
              break;
          }
          break;
      }
      const { selectError } = await supabase
        .from("change_log_tracker")
        .update({
          latest_change_log_id: logItem.index,
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

  return new Response("OK", { status: 200, headers: corsHeaders });
});
