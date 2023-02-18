import { useMemo } from "react";
import { FormContext } from "./context/createFormContext";
import { FormSchema } from "./schema/FormSchema";
import { _handleFieldChange, HandleFieldChangeFn } from "./handleFieldChange";
import { InternalFieldState } from "./store/InternalFieldState";

type InputProps = {
  value: string;
  name: string;
  onChange: HandleFieldChangeFn;
  onFocus: () => void;
  onBlur: () => void;
};

type ReturnType = {
  input: InputProps;
  meta: Omit<InternalFieldState, "value">;
};

export const useSimpleField = (
  ctx: FormContext<FormSchema>,
  field: { name: string }
): ReturnType => {
  // mutation functions

  const context = ctx.useContext();

  const input: Omit<InputProps, "value" | "name"> = useMemo(() => {
    const store = context.store;
    const name = field.name;

    return {
      onChange: _handleFieldChange(context.store, field.name),
      onFocus: () =>
        store.mutateField(name, (prev) => ({
          ...prev,
          visited: true,
          active: true,
        })),
      onBlur: () =>
        store.mutateField(name, (prev) => ({
          ...prev,
          touched: true,
          active: false,
        })),
    };
  }, [context.store, field.name]);

  // subscribing to field state

  const fieldState = ctx.useSelector((s) => s.fields[field.name], {
    fields: { [field.name]: true },
  });

  if (!fieldState) throw new Error(`field "${field.name}" is not initialized.`);

  const { value, ...meta } = fieldState;

  return {
    input: { value, name: field.name, ...input },
    meta,
  };
};
