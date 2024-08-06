import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { Database } from "./database.types.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

export const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
