import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeNotification } from "../../redux/reducer/notificationSlice";
import styles from "./ToastMessage.module.css";

export default function ToastMessage({ id, type, message, timeout, ...props }) {
  const ToastRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    ToastRef.current.style.opacity = 1;
    const Progress = ToastRef.current.lastElementChild;
    Progress.value = Progress.max;
    const timeInterVal = setInterval(() => {
      if (Progress.value <= 0) {
        clearInterval(timeInterVal);
        dispatch(removeNotification(id));
      }
      Progress.value -= 0.25;
    }, (0.2 * timeout) / 100);
  }, [timeout, id]);
  return (
    <div
      ref={ToastRef}
      className={`${styles.toast_message} ${styles[type]}`}
      {...props}
    >
      <span>{message}</span>
      <progress className={styles.progress} max="100"></progress>
    </div>
  );
}
