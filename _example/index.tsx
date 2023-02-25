import React, { ReactNode, useCallback, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { createFormContext } from "../src";
import { initializeField } from "../src/store/initializeField";
import { useSimpleField } from "../src/useSimpleField";

const form = createFormContext(
  {
    aaa: { type: "string" },
    bbb: { type: "string" },
    ccc: { type: "array", of: { type: "string" } },
  },
  {
    onPrepare: (e, store) => {
      store.mutateField("aaa", (prev) => ({
        ...prev,
        value: prev.value.toUpperCase(),
      }));
      const { fields } = store.state;
      if (!fields["ccc.0"]) return { type: "canceled" };
      if (fields["ccc.0"].value === "") return { type: "canceled" };
      return { type: "success", state: { aaa: fields.aaa.value } };
    },
  }
);

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
  const { input } = useSimpleField(form, form.$.aaa);

  return <input placeholder="aaa" {...input} />;
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
              [fieldName]: initializeField(""),
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
  const { input } = useSimpleField(form, { name });

  return <input placeholder={name} {...input} />;
};

const Validate: React.FC = () => {
  const context = form.useContext();

  useEffect(() => {
    const unregister = context.store.realtimeValidation(
      { aaa: true },
      "aaa",
      async ({ aaa }, { signal }) => {
        const rand = Math.random() * 1000;
        await new Promise((resolve) => {
          const timerId = window.setTimeout(resolve, rand);
          signal.addEventListener("abort", () => {
            window.clearTimeout(timerId);
          });
        });
        if (aaa.length >= 10) return `${aaa.length} ... TOO LONG!`;
        return undefined;
      }
    );
    return () => {
      unregister();
    };
  }, [context.store]);

  return null;
};

const Page: React.FC = () => {
  return (
    <form.Provider
      onSubmit={useCallback((ev, values) => {
        window.alert(JSON.stringify(values, null, 4));
      }, [])}
    >
      <button>Submit</button>
      <Validate />
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
