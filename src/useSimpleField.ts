import { useMemo } from "react";
import { FormContext } from "./context/createFormContext";
import { FormSchema } from "./schema/FormSchema";
import { _handleFieldChange, HandleFieldChangeFn } from "./handleFieldChange";
import { InternalFieldState } from "./store/InternalFieldState";

export const useSimpleField = (
  ctx: FormContext<FormSchema>,
  field: { name: string }
): { state: InternalFieldState; handleChange: HandleFieldChangeFn } => {
  const fieldState = ctx.useSelector((s) => s.fields[field.name], {
    fields: { [field.name]: true },
  });

  const context = ctx.useContext();
  const handleChange = useMemo(
    () => _handleFieldChange(context.store, field.name),
    [context.store, field.name]
  );

  return { state: fieldState, handleChange };
};
