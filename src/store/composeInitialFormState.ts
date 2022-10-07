import { initializeField } from "./initializeField";
import { InternalFormState } from "./InternalFormState";

export const composeInitialFormState = (
  flatInitialValues: Record<string, string>
): InternalFormState => {
  return {
    fields: Object.fromEntries(
      Object.entries(flatInitialValues).map(([k, v]) => [k, initializeField(v)])
    ),
  };
};
