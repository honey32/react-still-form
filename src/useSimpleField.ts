import { useCallback, useMemo } from "react";
import { FormContext } from "./context/createFormContext";
import { FormSchema } from "./schema/FormSchema";
import { _handleFieldChange, HandleFieldChangeFn } from "./handleFieldChange";
import { InternalFieldState } from "./store/InternalFieldState";

export const useSimpleField = (
  ctx: FormContext<FormSchema>,
  field: { name: string }
): {
  state: InternalFieldState;
  handleChange: HandleFieldChangeFn;
  onFocus: () => void;
  onBlur: () => void;
} => {
  const fieldState = ctx.useSelector((s) => s.fields[field.name], {
    fields: { [field.name]: true },
  });

  const context = ctx.useContext();
  const handleChange = useMemo(
    () => _handleFieldChange(context.store, field.name),
    [context.store, field.name]
  );

  const onFocus = useCallback(() => {
    context.store.mutateField(field.name, (prev) => ({
      ...prev,
      visited: true,
      active: true,
    }));
  }, [context.store, field.name]);

  const onBlur = useCallback(() => {
    context.store.mutateField(field.name, (prev) => ({
      ...prev,
      touched: true,
      active: false,
    }));
  }, [context.store, field.name]);

  if (!fieldState) throw new Error(`field "${field.name}" is not initialized.`);

  return { state: fieldState, handleChange, onFocus, onBlur };
};
