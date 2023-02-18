import { describe, expect, it } from "vitest";
import { encodeSchema } from "./EncodeSchema";

describe("FormSchema", () => {
  it("a", () => {
    expect(encodeSchema({ a: { type: "string" } })).toEqual(
      expect.objectContaining({ a: { name: "a", type: "string" } })
    );
  });

  it("array", () => {
    const fields = encodeSchema({
      a: { type: "array", of: { type: "string" } },
    });
    expect(fields.a._(0)).toEqual(
      expect.objectContaining({ name: "a.0", type: "string" })
    );
  });
});
