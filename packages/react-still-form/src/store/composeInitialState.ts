import { initializeField } from "./initializeField";
import { InternalFormState } from "./InternalFormState";

export const composeInitialState = (
  initialValues: Record<string, string>
): InternalFormState => {
  return {
    fields: Object.fromEntries(
      Object.entries(initialValues).map(([k, v]) => [k, initializeField(v)])
    ),
  };
};
