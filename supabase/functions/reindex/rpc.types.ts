import z from "npm:zod";

export const formatSecondsForTimestamp = z.number().transform((num) =>
  new Date(num * 1000).toISOString()
);

export const recipeQuerySchema = z.object({
  endpoint: z.string(),
  query: z.string(),
  variables: z.string(),
});

export const recipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string().optional(),
  creator: z.string(),
  created: formatSecondsForTimestamp,
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  queries: z.array(recipeQuerySchema),
  processor: z.string(),
  schema: z.string(),
  resolver: z.string(),
  revokable: z.boolean(),
  publish_state: z.string(),
});

export const runSchema = z.object({
  id: z.string(),
  recipe_id: z.string(),
  creator: z.string(),
  created: formatSecondsForTimestamp,
  chain_id: z.number(),
  gas: z.string().optional(),
  base_fee_per_gas: z.string().optional(),
  max_priority_fee_per_gas: z.string().optional(),
  user_fee: z.string().optional(),
  payment_transaction_hash: z.string().optional(),
  payment_block_number: z.string().optional(),
  payment_log_index: z.string().optional(),
  attestation_transaction_hash: z.string().optional(),
  attestation_uid: z.string().optional(),
  is_cancelled: z.boolean(),
  error: z.string().optional(),
});

export type Run = z.infer<typeof runSchema>;

export const typeNameSchema = z.union([
  z.object({ Recipe: z.null() }),
  z.object({ Run: z.null() }),
  z.object({ User: z.null() }),
]).transform((obj) => {
  if ("Recipe" in obj) return "Recipe";
  if ("Run" in obj) return "Run";
  if ("User" in obj) return "User";
  throw new Error("Invalid type");
});

export type TypeName = z.infer<typeof typeNameSchema>;

export const changeLogActionSchema = z.union([
  z.object({ Create: z.null() }),
  z.object({ Update: z.null() }),
  z.object({ Delete: z.null() }),
]).transform((obj) => {
  if ("Create" in obj) return "Create";
  if ("Update" in obj) return "Update";
  if ("Delete" in obj) return "Delete";
  throw new Error("Invalid action");
});

export type ChangeLogAction = z.infer<typeof changeLogActionSchema>;

export const changeLogItemSchema = z.object({
  type_name: typeNameSchema,
  id: z.string(),
  action: changeLogActionSchema,
  patch: z.string(),
});

export type ChangeLogItem = z.infer<typeof changeLogItemSchema>;

export const indexedChangeLogItemSchema = z.object({
  index: z.number(),
  data: changeLogItemSchema,
});

export type IndexedChangeLogItem = z.infer<typeof indexedChangeLogItemSchema>;

export const changelLogOkResponseSchema = z.object({
  total_count: z.number(),
  data: z.array(indexedChangeLogItemSchema),
});

export type ChangelLogOkResponse = z.infer<typeof changelLogOkResponseSchema>;

export const httpErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  details: z.string().optional(),
});

export type HttpError = z.infer<typeof httpErrorSchema>;

export const changeLogResponseSchema = z.union([
  z.object({
    Ok: changelLogOkResponseSchema,
  }),
  z.object({
    Err: httpErrorSchema,
  }),
]);

export type ChangeLogResponse = z.infer<typeof changeLogResponseSchema>;
