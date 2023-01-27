import { createContext, useContext, useEffect, useState } from "react";

const Kits = createContext();

export default function Checkbox({
  children,
  checked = [],
  setChecked = null,
  type = "checkbox",
  name = "",
  ...props
}) {
  const [checks, setChecks] = useState(checked);

  useEffect(() => {
    if (typeof setChecked === "function") setChecked(checks);
  }, [checks]);

  return (
    <Kits.Provider value={{ checks, setChecks, type, name }}>
      <fieldset className="border-none" {...props}>
        {children}
      </fieldset>
    </Kits.Provider>
  );
}

Checkbox.Item = function Item({
  children,
  value = children,
  defaultChecked = false,
  onChange,
  ...props
}) {
  const { checks, setChecks, type, name } = useContext(Kits);
  const handleCheck = () => {
    if (type === "checkbox")
      setChecks((prev) =>
        prev.includes(value)
          ? prev.filter((i) => i !== value)
          : [...prev, value]
      );
    else if (type === "radio") setChecks([value]);
  };

  useEffect(() => {
    if (defaultChecked) handleCheck();
  }, [defaultChecked]);

  return (
    <>
      <input
        {...props}
        type={type}
        name={name}
        value={value}
        onChange={(e) => {
          if (typeof onChange === "function") onChange(e);
          handleCheck();
        }}
        checked={checks.includes(value)}
      />
      {children}
    </>
  );
};
