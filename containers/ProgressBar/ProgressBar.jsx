import { useState, useEffect } from "react";
import { Icon } from "../../components";
import styles from "./progressbar.module.scss";
export default function ProgressBar({
  pass = "",
  steps = [{ title: "", icon: null, allowed: false }],
  setSteps = new Function(),
}) {
  const [progress, setProgress] = useState(() =>
    steps.map((item) => ({ ...item, active: false }))
  );
  const setNewProgress = (index) => {
    setProgress((prev) => {
      let newArr = JSON.parse(JSON.stringify(prev));
      newArr[index].active = true;
      return newArr;
    });
  };
  const handleComplete = (step, index) => {
    if (step.allowed)
      if (index - 1 >= 0) progress[index - 1].active && setNewProgress(index);
      else if (index === 0) setNewProgress(index);
  };
  useEffect(() => {
    if (pass) {
      const step = steps.findIndex((item) => item.title === pass);
      for (let i = 0; i < step; i++) setNewProgress(i);
    }
  }, [pass]);
  useEffect(() => setSteps(progress), [progress]);
  return (
    <div id={styles.steps}>
      {progress.map((step, index) => {
        return (
          <div
            key={index}
            className={`${styles.step} ${step.active && styles.active}`}
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
