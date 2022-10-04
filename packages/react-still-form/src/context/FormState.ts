import { InternalFormState } from "../store/InternalFormState";

export type FormState = InternalFormState;

export const formStateFromInternal = (internal: InternalFormState): FormState => {
  return internal;
};
