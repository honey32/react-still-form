import { describe, expect, it } from "vitest";
import { encodeSchema } from "./EncodeSchema";

describe("FormSchema", () => {
  it("a", () => {
    expect(encodeSchema({ a: { type: "string" } })).toEqual(
      expect.objectContaining({ a: { name: "a" } })
    );
  });
});
