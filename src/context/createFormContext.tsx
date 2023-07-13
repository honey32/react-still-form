import React, {
  createContext,
  FormEvent,
  FormEventHandler,
  ReactNode,
  useCallback,
  useContext as React_useContext,
  useRef,
} from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";

import { composeInitialFormState } from "../store/composeInitialFormState";
import { FormStore } from "../store/FormStore";
import { FormSchema } from "../schema/FormSchema";
import { FormState, formStateFromInternal } from "./FormState";
import { flatInitialValuesFromSchema } from "../schema/FlatInitialValuesForSchema";
import { EncodeSchema, encodeSchema } from "../schema/EncodeSchema";

type OrPromise<T> = T | Promise<T>;

type FormContextContents<Sc extends FormSchema> = {
  store: FormStore;
  schema: Sc;
};

export type FormContext<Sc extends FormSchema> = {
  useContext: () => FormContextContents<Sc>;

  useSelector: <T extends unknown>(
    selector: (s: FormState) => T,
    options?: Parameters<FormStore["subscribe"]>[1]
  ) => T;

  Provider: React.FC<{
    children: ReactNode;
    onSubmit: (
      e: FormEvent<HTMLFormElement>,
      values: Record<string, string>
    ) => OrPromise<void>;

    onPrepare: (
      e: FormEvent<HTMLFormElement>,
      store: FormStore,
      schema: Sc
    ) => OrPromise<
      { type: "success"; state: Record<string, string> } | { type: "canceled" }
    >;
  }>;

  $: EncodeSchema<Sc>;
};

export const createFormContext = <Sc extends FormSchema>(
  schema: Sc
): FormContext<Sc> => {
  type Context = FormContext<Sc>;

  const ctx = createContext<FormContextContents<Sc> | undefined>(undefined);

  const useContext: Context["useContext"] = () => {
    const contents = React_useContext(ctx);
    if (!contents)
      throw Error("useContext should be used inside of the provider");
    return contents;
  };

  const useSelector: Context["useSelector"] = (selector, options) => {
    const { store } = useContext();

    const composedSelector = useCallback(
      (internal: typeof store.state) =>
        selector(formStateFromInternal(internal)),
      [selector, store]
    );

    return useSyncExternalStoreWithSelector(
      (fn) => store.subscribe(fn, options),
      () => store.state,
      () => store.state,
      composedSelector
    );
  };

  const Provider: Context["Provider"] = ({
    children,
    onSubmit,
    onPrepare = (_e, store) => {
      const entries = Object.entries(store.state.fields).map(
        ([k, v]) => [k, v.value] as const
      );
      const obj = Object.fromEntries(entries);
      return { type: "success", state: obj };
    },
  }) => {
    const ref = useRef({
      store: new FormStore(
        composeInitialFormState(flatInitialValuesFromSchema(schema))
      ),
      schema,
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
      (e) => {
        e.preventDefault();
        void Promise.resolve(
          onPrepare(e, ref.current.store, ref.current.schema)
        ).then(async (result) => {
          if (result.type !== "success") {
            return;
          }
          await onSubmit(e, result.state);
        });
      },
      [onPrepare, onSubmit]
    );

    return (
      <ctx.Provider value={ref.current}>
        <form onSubmit={handleSubmit}>{children}</form>
      </ctx.Provider>
    );
  };

  return { useContext, useSelector, Provider, $: encodeSchema(schema) };
};
