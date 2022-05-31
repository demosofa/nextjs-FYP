import { cloneElement } from "react";
// import "./badge.scss";

export default function Badge({ children, value = 0, ...props }) {
  return (
    <div className="badge-container" {...props}>
      <div className="badge">{value}</div>
      {cloneElement(children, {
        style: {
          margin: 0,
          fontSize: "25px",
          color: "white",
        },
      })}
    </div>
  );
}
