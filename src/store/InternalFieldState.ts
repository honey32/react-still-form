export type InternalFieldState = {
  initialValue: string;
  value: string;
  modified: boolean;
  visited: boolean;
  touched: boolean;
  active: boolean;
  realtimeError: unknown | undefined;
  isValidating: boolean;
};
