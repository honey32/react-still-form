export type FieldSchema =
  | {
      type: "string";
    }
  | { type: "array"; of: FieldSchema };

export type FormSchema = Record<string, FieldSchema>;
