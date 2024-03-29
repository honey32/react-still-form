type TaskState = {
  name: string;
  values: Record<string, string>;
  ac: AbortController;
};

export class AsyncTaskManager {
  #map: Map<string, TaskState> = new Map();

  tryToExecute<Values extends Record<string, string>>(
    targetName: string,
    values: Values,
    taskFn: (values: Values, ac: AbortController) => Promise<void>
  ): void {
    const state = this.#map.get(targetName);

    // if task is running, abort it.
    state?.ac.abort();

    // execute async task without awaiting
    const ac = new AbortController();
    this.#map.set(targetName, { name: targetName, values, ac });
    void taskFn(values, ac);
  }
}
