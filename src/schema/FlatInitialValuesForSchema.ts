import type { FieldSchema, FormSchema } from "./FormSchema";
import type { InternalFieldState } from "../store/InternalFieldState";

export type FlatInitialValuesForSchema<Sc extends FormSchema> = {
  [K in keyof Sc & string as KeyForFieldSchema<K, Sc[K]>]: TypeForFieldSchema<
    Sc[K]
  >;
};

type KeyForFieldSchema<Name extends string, F extends FieldSchema> = {
  string: Name;
}[F["type"]];

type TypeForFieldSchema<F extends FieldSchema> = {
  string: string;
}[F["type"]];

export const flatInitialValuesFromSchema = <Sc extends FormSchema>(
  schema: Sc
): FlatInitialValuesForSchema<Sc> => {
  const entries = Object.entries(schema).map(
    ([k, v]) => [k, fields[v.type]()] as const
  );
  return Object.fromEntries(
    entries
  ) as unknown as FlatInitialValuesForSchema<Sc>;
};

const fields = {
  string: (): InternalFieldState["initialValue"] => "",
};

