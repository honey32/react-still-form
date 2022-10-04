import { describe, expect, it, vi } from "vitest";
import { composeInitialFormState } from "./composeInitialFormState";
import { FormStore } from "./FormStore";

describe("FormStore", () => {
  it("mutate", () => {
    const store = new FormStore(composeInitialFormState({}));

    const fn = vi.fn(() => {});

    const unsubscribe = store.subscribe(fn);
    store.mutate((prev) => prev);
    expect(fn).toBeCalled();

    unsubscribe();
    store.mutate((prev) => prev);
    expect(fn).toBeCalledTimes(1);
  });

  it("mutateField", () => {
    const store = new FormStore(
      composeInitialFormState({ aaa: "a", bbb: "b" })
    );

    const fn = vi.fn(() => {});

    const unsubscribe = store.subscribe(fn, { fields: { aaa: true } });
    store.mutateField("aaa", (prev) => prev);
    expect(fn).toBeCalled();

    // irrelevant field update to be ignored
    store.mutateField("bbb", (prev) => prev);
    expect(fn).toBeCalledTimes(1);

    unsubscribe();
    store.mutateField("aaa", (prev) => prev);
    expect(fn).toBeCalledTimes(1);
  });
});
