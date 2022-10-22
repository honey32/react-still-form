import { FormEventListener } from "./FormEventListener";
import { InternalFieldState } from "./InternalFieldState";
import { InternalFormState } from "./InternalFormState";

export class FormStore {
  #state: InternalFormState;
  #listeners: FormEventListener[] = [];

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
}
