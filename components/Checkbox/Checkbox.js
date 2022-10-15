import { useState, useEffect, createContext, useContext } from "react";

const Kits = createContext();

export default function Checkbox({
  children,
  checked = [],
  setChecked = new Function(),
  type = "checkbox",
  name = "",
  ...props
}) {
  const [checks, setChecks] = useState(checked);

  useEffect(() => setChecked(checks), [checks]);

  return (
    <Kits.Provider value={{ checks, setChecks, type, name }}>
      <fieldset style={{ border: "none", padding: 0 }} {...props}>
        {children}
      </fieldset>
    </Kits.Provider>
  );
}

Checkbox.Item = function Item({
  children,
  value = children,
  defaultChecked = false,
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
        onChange={handleCheck}
        checked={checks.includes(value)}
      />
      {children}
    </>
  );
};
