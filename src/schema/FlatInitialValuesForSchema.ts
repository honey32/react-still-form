import type { FormSchema } from "./FormSchema";

export const flatInitialValuesFromSchema = <Sc extends FormSchema>(
  schema: Sc
): Record<string, string> => {
  const entries = Object.entries(schema)
    .flatMap(([k, v]) => (v.type === "string" ? [{ k, v: "" }] : []))
    .map(({ k, v }) => [k, v]);
  return Object.fromEntries(entries);
};
