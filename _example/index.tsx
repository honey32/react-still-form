import React, { useCallback } from "react";
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

const InputC0: React.FC = () => {
  const { state, handleChange } = useSimpleField(form, form.$.ccc._(0));

  return (
    <input placeholder="ccc.0" value={state.value} onChange={handleChange} />
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
      <div>
        <InputC0 />
      </div>
    </form.Provider>
  );
};

ReactDOM.render(<Page />, document.getElementById("root"));
