import { FieldSchema, FormSchema } from "./FormSchema";

type EncodeField<F extends FieldSchema> = F extends { type: "string" }
  ? {
      name: string;
      type: "string";
    }
  : F extends { type: "array" }
  ? { type: "array"; _: (index: number) => EncodeField<F["of"]> }
  : never;

export type EncodeSchema<Sc extends FormSchema> = {
  [K in keyof Sc]: EncodeField<Sc[K]>;
};

export const encodeSchema = <Sc extends FormSchema>(
  sc: Sc
): EncodeSchema<Sc> => {
  const encodeField = (k: string, f: FieldSchema): EncodeField<FieldSchema> => {
    if (f.type === "string")
      return {
        name: k,
        type: f.type,
      };

    if (f.type === "array")
      return {
        type: f.type,
        _: (index: number) => {
          return encodeField(`${k}.${index}`, f.of);
        },
      };

    throw new Error("unreacheable");
  };
  const entries = Object.entries(sc).map(([k, v]) => [k, encodeField(k, v)]);
  return Object.fromEntries(entries);
};
