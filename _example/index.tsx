import React, { ReactNode, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import { createFormContext } from "../src";
import { useSimpleField } from "../src/useSimpleField";

const form = createFormContext({
  aaa: { type: "string" },
  bbb: { type: "string" },
  ccc: { type: "array", of: { type: "string" } },
});

const JsonAll: React.FC = () => {
  const json = form.useSelector((s) => JSON.stringify(s, null, 2));
  return (
    <pre>
      <code>{json}</code>
    </pre>
  );
};

const AddA: React.FC = () => {
  const { store } = form.useContext();
  const handleClick = useCallback(() => {
    store.mutateField("aaa", (prev) => ({
      ...prev,
      value: prev.value + "a",
    }));
  }, [store]);
  return <button onClick={handleClick}>クリック！</button>;
};

const InputB: React.FC = () => {
  const { state, handleChange } = useSimpleField(form, form.$.aaa);

  return (
    <input placeholder="aaa" value={state.value} onChange={handleChange} />
  );
};

const SwitchC0: React.FC = () => {
  const context = form.useContext();

  const handleClick = (): void => {
    context.store.mutate((s) => {
      for (let i = 0; true; i++) {
        const fieldName = form.$.ccc._(i).name;
        if (!Object.hasOwn(s.fields, fieldName)) {
          return {
            ...s,
            fields: {
              ...s.fields,
              [fieldName]: { initialValue: "", value: "" },
            },
          };
        }
      }
    });
  };

  const size = form.useSelector((s) => {
    for (let i = 0; true; i++) {
      const fieldName = form.$.ccc._(i).name;
      if (!Object.hasOwn(s.fields, fieldName)) {
        return i;
      }
    }
  });

  const fields = useMemo(() => {
    const arr: ReactNode[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(
        <div key={i}>
          <InputC0 name={form.$.ccc._(i).name} />
        </div>
      );
    }
    return arr;
  }, [size]);

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Show / Remove Input CCC.0
      </button>

      {fields}
    </div>
  );
};

const InputC0: React.FC<{ name: string }> = ({ name }) => {
  const { state, handleChange } = useSimpleField(form, { name });

  return (
    <input placeholder={name} value={state.value} onChange={handleChange} />
  );
};

const Page: React.FC = () => {
  return (
    <form.Provider>
      <JsonAll />
      <AddA />
      <div>
        <InputB />
      </div>

      <SwitchC0 />

      {/* This causes error. */}
      {/* <InputC0 name={form.$.ccc._(100).name} /> */}
    </form.Provider>
  );
};

ReactDOM.render(<Page />, document.getElementById("root"));
