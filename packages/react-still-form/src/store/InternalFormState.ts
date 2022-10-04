import { InternalFieldState } from "./InternalFieldState"

export type InternalFormState = {
  fields: Record<string, InternalFieldState>
}