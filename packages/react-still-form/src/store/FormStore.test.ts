import { describe, expect, it, vi } from "vitest";
import { composeInitialState } from "./composeInitialState";
import { FormStore } from "./FormStore";

describe("FormStore", () => {
  it("mutate", () => {
    const store = new FormStore(composeInitialState({}));

    const fn = vi.fn(() => {});

    const unsubscribe = store.subscribe(fn);
    store.mutate((prev) => prev);
    expect(fn).toBeCalled();

    unsubscribe();
    store.mutate((prev) => prev);
    expect(fn).toBeCalledTimes(1);
  });

  it("mutateField", () => {
    const store = new FormStore(composeInitialState({ aaa: "a" }));

    const fn = vi.fn(() => {});

    const unsubscribe = store.subscribe(fn, { fields: { aaa: true } });
    store.mutateField("aaa", (prev) => prev);
    expect(fn).toBeCalled();

    unsubscribe();
    store.mutateField("aaa", (prev) => prev);
    expect(fn).toBeCalledTimes(1);
  });
});
