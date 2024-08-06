import z from "npm:zod";

export const formatHexStringForByteA = z.string().transform((hexString) =>
  "\\x" + hexString.substring(2)
);

export const formatHexStringForByteAOptional = z
  .string()
  .optional()
  .transform((hexString) =>
    hexString !== undefined ? "\\x" + hexString.substring(2) : undefined
  );

export const formatSecondsForTimestamp = z.number().transform((num) =>
  new Date(num * 1000).toISOString()
);

export const recipeQuerySchema = z.object({
  endpoint: z.string(),
  query: z.string(),
  variables: z.string(),
});

export const recipeSchema = z.object({
  id: formatHexStringForByteA,
  name: z.string(),
  displayName: z.string().optional(),
  creator: formatHexStringForByteA,
  created: formatSecondsForTimestamp,
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  queries: z.array(recipeQuerySchema),
  processor: z.string(),
  schema: z.string(),
  resolver: formatHexStringForByteA,
  revokable: z.boolean(),
  publish_state: z.string(),
});

export const runSchema = z.object({
  id: formatHexStringForByteA,
  recipe_id: formatHexStringForByteA,
  creator: formatHexStringForByteA,
  created: formatSecondsForTimestamp,
  chain_id: z.number(),
  gas: formatHexStringForByteAOptional,
  base_fee_per_gas: formatHexStringForByteAOptional,
  max_priority_fee_per_gas: formatHexStringForByteAOptional,
  user_fee: formatHexStringForByteAOptional,
  payment_transaction_hash: formatHexStringForByteAOptional,
  payment_block_number: formatHexStringForByteAOptional,
  payment_log_index: formatHexStringForByteAOptional,
  attestation_transaction_hash: formatHexStringForByteAOptional,
  attestation_uid: formatHexStringForByteAOptional,
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
  id: formatHexStringForByteA,
  action: changeLogActionSchema,
  patch: z.string(),
});

export type ChangeLogItem = z.infer<typeof changeLogItemSchema>;

export const indexedChangeLogItemSchema = z.object({
  index: z.number(),
  item: changeLogItemSchema,
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
