import { InternalFieldState } from "./InternalFieldState";

export const initializeField = (initialValue: string): InternalFieldState => {
  return { initialValue: initialValue, value: initialValue };
};
