import { useEffect, useState } from "react";
import { Icon } from "../../components";
import styles from "./progressbar.module.scss";
export default function ProgressBar({
  pass = "",
  steps = [{ title: "", icon: null, allowed: false }],
  setSteps = new Function(),
  onResult = new Function(),
  ...props
}) {
  const [progress, setProgress] = useState(() =>
    steps.map((item) => ({ ...item, active: false }))
  );
  const [targetIndex, setTargetIndex] = useState(() =>
    steps.findIndex((item) => item.title === pass)
  );
  const setNewProgress = (index) => {
    setTargetIndex(index);
    setProgress((prev) => {
      let newArr = JSON.parse(JSON.stringify(prev));
      newArr[index].active = true;
      return newArr;
    });
  };
  const handleComplete = (step, index) => {
    if (step.allowed)
      if (index - 1 >= 0) {
        if (progress[index - 1].active) {
          setNewProgress(index);
        }
      } else if (index === 0) {
        setNewProgress(index);
      }
  };
  useEffect(() => {
    if (pass) {
      const step = steps.findIndex((item) => item.title === pass);
      for (let i = 0; i <= step; i++) setNewProgress(i);
    }
  }, [pass]);
  useEffect(() => {
    setSteps(progress);
    onResult(progress[targetIndex].title);
  }, [progress]);
  return (
    <div id={styles.steps}>
      {progress.map((step, index) => {
        return (
          <div
            key={index}
            className={`${styles.step} ${step.active && styles.active}`}
            style={{ cursor: step.allowed ? "pointer" : "not-allowed" }}
            data-desc={step.title}
            onClick={() => handleComplete(step, index)}
            {...props}
          >
            {(step.icon && <Icon>{step.icon}</Icon>) || index + 1}
          </div>
        );
      })}
    </div>
  );
}
