import { ChangeEvent } from "react";
import { FormStore } from "./store/FormStore";

export type HandleFieldChangeFn = (
  ev: string | ChangeEvent<HTMLInputElement>
) => void;

export const _handleFieldChange =
  (store: FormStore, name: string): HandleFieldChangeFn =>
  (ev) => {
    const newValue = typeof ev === "string" ? ev : ev.target.value;
    store.mutateField(name, (prev) => ({ ...prev, value: newValue }));
  };
