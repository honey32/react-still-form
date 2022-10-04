import React, { useCallback } from "react";
import ReactDOM from "react-dom";
import { createFormContext } from "../src";

const form = createFormContext();
const JsonAll = () => {
  const json = form.useSelector((s) => JSON.stringify(s, null, 2));
  return <div>{json}</div>;
};

const AddA = () => {
  const { store } = form.useContext();
  const handleClick = useCallback(() => {
    store.mutate((prev) => ({
      ...prev,
      fields: { a: { initialValue: "", value: "a" } },
    }));
  }, []);
  return <button onClick={handleClick}>クリック！</button>;
};

const Page = () => {
  return (
    <form.Provider>
      <JsonAll />
      <AddA />
    </form.Provider>
  );
};

ReactDOM.render(<Page />, document.getElementById("root"));
