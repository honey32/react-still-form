import { InternalFieldState } from "./InternalFieldState";

export const initializeField = (initialValue: string): InternalFieldState => {
  return {
    initialValue,
    value: initialValue,
    modified: false,
    visited: false,
    touched: false,
    active: false,
    isValidating: false,
    realtimeError: undefined,
  };
};
