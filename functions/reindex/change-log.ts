import { supabase } from "./db.ts";

export async function getNextLogIndex(): Promise<number> {
  const { data } = await supabase
    .from("change_log_tracker")
    .select("latest_change_log_id")
    .eq("id", 1)
    .single();

  if (!data || data.latest_change_log_id === null) {
    return 0;
  }

  return data.latest_change_log_id + 1;
}
