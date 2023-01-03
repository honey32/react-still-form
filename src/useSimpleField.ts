import { useMemo } from "react";
import { FormContext } from "./context/createFormContext";
import { FlatInitialValuesForSchema } from "./schema/FlatInitialValuesForSchema";
import { FormSchema } from "./schema/FormSchema";
import { _handleFieldChange, HandleFieldChangeFn } from "./handleFieldChange";
import { InternalFieldState } from "./store/InternalFieldState";

export const useSimpleField = <Sc extends FormSchema>(
  ctx: FormContext<Sc>,
  name: keyof FlatInitialValuesForSchema<Sc>
): { state: InternalFieldState; handleChange: HandleFieldChangeFn } => {
  const fieldState = ctx.useSelector((s) => s.fields[name], {
    fields: { [name]: true },
  });

  const context = ctx.useContext();
  const handleChange = useMemo(
    () => _handleFieldChange(context.store, name),
    [context.store, name]
  );

  return { state: fieldState, handleChange };
};
