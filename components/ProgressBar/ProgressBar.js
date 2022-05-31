import { useState, useEffect } from "react";
import { Icon } from "../";
// import "./progressbar.scss";
export default function ProgressBar({
  steps = [{ title: "", icon: null, active: false, allowed: false }],
  setSteps = new Function(),
}) {
  const [progress, setProgress] = useState(steps);
  const handleComplete = (step, index) => {
    if (step.allowed)
      if (index - 1 >= 0)
        progress[index - 1].active &&
          setProgress((prev) => {
            let newArr = [...prev];
            newArr[index].active = true;
            return newArr;
          });
      else if (index === 0)
        setProgress((prev) => {
          let newArr = [...prev];
          newArr[index].active = true;
          return newArr;
        });
  };
  useEffect(() => setSteps(progress), [progress]);
  return (
    <div id="steps">
      {progress.map((step, index) => {
        return (
          <div
            key={index}
            className={"step " + (step.active && "active")}
            data-desc={step.title}
            onClick={() => handleComplete(step, index)}
          >
            {(step.icon && <Icon>{step.icon}</Icon>) || index}
          </div>
        );
      })}
    </div>
  );
}
