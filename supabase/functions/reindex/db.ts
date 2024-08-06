import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { Database } from "./database.types.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

export const supabase = createClient<Database>(
  Deno.env.get("DB_URL")!,
  Deno.env.get("DB_SERVICE_ROLE_KEY")!,
);
