import React, { useCallback } from "react";
import ReactDOM from "react-dom";
import { createFormContext } from "../src";
import { useSimpleField } from "../src/useSimpleField";

const form = createFormContext({
  aaa: { type: "string" },
  bbb: { type: "string" },
});

const JsonAll: React.FC = () => {
  const json = form.useSelector((s) => JSON.stringify(s, null, 2));
  return <div>{json}</div>;
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
  const { state, handleChange } = useSimpleField(form, form.fields.aaa);

  return <input value={state.value} onChange={handleChange} />;
};

const Page: React.FC = () => {
  return (
    <form.Provider>
      <JsonAll />
      <AddA />
      <InputB />
    </form.Provider>
  );
};

ReactDOM.render(<Page />, document.getElementById("root"));
