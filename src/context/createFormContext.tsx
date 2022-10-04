import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext as React_useContext,
  useRef,
} from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";

import { composeInitialFormState } from "../store/composeInitialFormState";
import { FormStore } from "../store/FormStore";
import { FormState, formStateFromInternal } from "./FormState";

type FormContextContents = {
  store: FormStore;
};

type FormContext = {
  useContext: () => FormContextContents;

  useSelector: <T extends unknown>(
    selector: (s: FormState) => T,
    options?: Parameters<FormStore["subscribe"]>[1]
  ) => T;

  Provider: React.FC<{ children: ReactNode }>;
};

export const createFormContext = (): FormContext => {
  type Context = FormContext;

  const ctx = createContext<FormContextContents | undefined>(undefined);

  const useContext: Context["useContext"] = () => {
    const contents = React_useContext(ctx);
    if (!contents)
      throw Error("useContext should be used inside of the provider");
    return contents;
  };

  const useSelector: Context["useSelector"] = (selector, options) => {
    const { store } = useContext();

    const composedSelector = useCallback(
      (internal: typeof store.state) => selector(formStateFromInternal(internal)),
      [selector]
    );

    return useSyncExternalStoreWithSelector(
      (fn) => store.subscribe(fn, options),
      () => store.state,
      () => store.state,
      composedSelector
    );
  };

  const Provider: Context["Provider"] = ({ children }) => {
    const ref = useRef({ store: new FormStore(composeInitialFormState({})) });

    return <ctx.Provider value={ref.current}>{children}</ctx.Provider>;
  };

  return { useContext, useSelector, Provider };
};
