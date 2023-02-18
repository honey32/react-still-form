import { AsyncTaskManager } from "../validation/AsyncTaskManager";
import { FormEventListener } from "./FormEventListener";
import { InternalFieldState } from "./InternalFieldState";
import { InternalFormState } from "./InternalFormState";

export class FormStore {
  #state: InternalFormState;
  #listeners: FormEventListener[] = [];
  #validationManager = new AsyncTaskManager();

  constructor(readonly initialState: InternalFormState) {
    this.#state = initialState;
  }

  get state(): InternalFormState {
    return this.#state;
  }

  notify(options: { fieldName?: string } = {}): void {
    const { fieldName } = options;
    this.#listeners
      .filter((listener) => {
        if (!fieldName) return true;
        if (!listener.fields) return true;
        if (fieldName in listener.fields) return true;
        return false;
      })
      .forEach((l) => {
        l.fn();
      });
  }

  subscribe(
    fn: () => void,
    options: { fields?: Record<string, boolean> } = {}
  ): () => void {
    const listener = { fn, fields: options.fields };
    this.#listeners.push(listener);
    return () => {
      this.#listeners = this.#listeners.filter((l) => l !== listener);
    };
  }

  mutate(fn: (prev: InternalFormState) => InternalFormState): void {
    this.#state = fn(this.#state);
    this.notify();
  }

  mutateField(
    name: string,
    fn: (prev: InternalFieldState) => InternalFieldState
  ): void {
    this.#state = {
      ...this.#state,
      fields: {
        ...this.#state.fields,
        [name]: fn(this.#state.fields[name]),
      },
    };

    this.notify({ fieldName: name });
  }

  realtimeValidation<Fields extends Record<string, boolean>>(
    fields: Fields,
    targetName: string,
    fn: (
      values: Record<keyof Fields, string>,
      options: { signal: AbortSignal }
    ) => PromiseLike<unknown> | unknown
  ): () => void {
    return this.subscribe(() => {
      const valuesEntries = Object.entries(fields)
        .filter(([_, v]) => v)
        .map(([k]) => [k, this.#state.fields[k].value] as const);
      const values = Object.fromEntries(valuesEntries) as Record<
        keyof Fields,
        string
      >;

      this.#validationManager.tryToExecute(
        targetName,
        values,
        async (values, ac) => {
          this.mutateField(targetName, (prev) => ({
            ...prev,
            isValidating: true,
          }));

          const validationError = await fn(values, { signal: ac.signal });

          if (ac.signal.aborted) {
            this.mutateField(targetName, (prev) => ({
              ...prev,
              isValidating: false,
            }));
            return;
          }
          this.mutateField(targetName, (prev) => ({
            ...prev,
            realtimeError: validationError,
            isValidating: false,
          }));
        }
      );
    }, fields);
  }
}
