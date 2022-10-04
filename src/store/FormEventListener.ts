export type  FormEventListener = {
  fn: () => void,
  fields?: Record<string, boolean>
}