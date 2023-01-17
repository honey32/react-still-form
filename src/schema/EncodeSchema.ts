import { FormSchema } from "./FormSchema";

export type EncodeSchema<Sc extends FormSchema> = {
  [K in keyof Sc]: {
    name: string;
  };
};

export const encodeSchema = <Sc extends FormSchema>(
  sc: Sc
): EncodeSchema<Sc> => {
  const entries = Object.entries(sc).map(([k, v]) => {
    const value: { name: string; type: typeof v["type"] } = {
      name: k,
      type: v.type,
    };
    return [k, value];
  });
  return Object.fromEntries(entries);
};
