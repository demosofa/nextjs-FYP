import { useState, useEffect, createContext, useContext } from "react";

const Kits = createContext();

export default function Checkbox({
  children,
  forParent = new Function(),
  ...props
}) {
  const [checks, setChecks] = useState([]);
  useEffect(() => forParent(checks), [checks]);
  return (
    <Kits.Provider value={{ checks, setChecks }}>
      <div
        style={{
          width: "300px",
          height: "500px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          border: "1px dotted",
        }}
        {...props}
      >
        {children}
      </div>
    </Kits.Provider>
  );
}

Checkbox.Item = function Item({
  children,
  type = "checkbox",
  name = "",
  value = children,
  ...props
}) {
  const { checks, setChecks } = useContext(Kits);
  const handleCheck = () => {
    if (type === "checkbox")
      setChecks((prev) =>
        prev.includes(value)
          ? prev.filter((i) => i !== value)
          : [...prev, value]
      );
    else if (type === "radio") setChecks([value]);
  };
  return (
    <div {...props}>
      {children}
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleCheck}
        checked={checks.includes(value)}
      ></input>
    </div>
  );
};
