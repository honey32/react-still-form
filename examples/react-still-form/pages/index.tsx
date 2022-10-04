import { NextPage } from "next";
import { createFormContext } from "@react-still-form/core";
import { useCallback } from "react";

const formContext = createFormContext();

const JsonDisplay = () => {
  const jsonStr = formContext.useSelector((s) =>
    JSON.stringify(s.fields, null, 2)
  );
  return (
    <div>
      <pre>
        <code>{jsonStr}</code>
      </pre>
    </div>
  );
};

const Updater = () => {
  const form = formContext.useContext();
  const handleClick = useCallback(() => {
    form.store.mutate((prev) => ({
      ...prev,
      fields: { a: { value: "aaaa", initialValue: "aaaa" } },
    }));
  }, [form.store]);
  return <button onClick={handleClick}>クリック！</button>;
};

const IndexPage: NextPage = () => {
  return (
    <div>
      <formContext.Provider>
        <JsonDisplay />
        <Updater />
      </formContext.Provider>
    </div>
  );
};
export default IndexPage;
