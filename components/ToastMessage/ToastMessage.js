import { useRef, useEffect, forwardRef } from "react";
// import { useSearchParams } from "react-router-dom";
import styles from "./ToastMessage.module.css";

const ToastMessage = forwardRef(({ type, message, timeout }) => {
  // const [query, setQuery] = useSearchParams();
  const ToastRef = useRef();
  // useEffect(() => {
  //   ToastRef.current.style.opacity = 1;
  //   const LoaderBar = ToastRef.current.lastElementChild.children[0];
  //   LoaderBar.style.width = "0%";
  //   const timeoutVal = setTimeout(() => {
  //     clearTimeout(timeoutVal);
  //     ToastRef.current.parentElement.removeChild(ToastRef.current);
  //   }, timeout * 1000 + 100);
  // }, []);
  // return (
  //   <div
  //     ref={ToastRef} className={`${styles.ToastMessage} ${styles[type]}`}
  //   >
  //     <span>{message}</span>
  //     <div className={styles.Loader}>
  //       <div className={styles.Bar} style={{transition: `all ${timeout}s cubic-bezier(0,0,1,1)`}}></div>
  //     </div>
  //   </div>
  // );

  // const [render, setRender] = useState(true);
  // useEffect(() => {
  //   const timeoutVal = setTimeout(() => {
  //       clearTimeout(timeoutVal);
  //       setRender(false)
  //     }, timeout + 100);
  // }, []);
  // return render ?
  //   (<div
  //     ref={ToastRef}
  //     className={`${styles.ToastMessage} ${styles[type]}`}
  //     style={{ opacity: "1" }}
  //   >
  //     <span>{message}</span>
  //     <div className={styles.Loader}>
  //       <div
  //         className={styles.Bar}
  //         style={{
  //           "--timeout": `${timeout / 1000}s`,
  //         }}
  //       ></div>
  //     </div>
  //   </div>
  // ): null;

  useEffect(() => {
    ToastRef.current.style.opacity = 1;
    const Progress = ToastRef.current.lastElementChild;
    Progress.value = Progress.max;
    const timeInterVal = setInterval(() => {
      Progress.value -= 0.25;
      if (Progress.value === 0) {
        clearInterval(timeInterVal);
        ToastRef.current.parentElement.removeChild(ToastRef.current);
      }
    }, (0.2 * timeout) / 100);
  }, [timeout]);
  return (
    <div ref={ToastRef} className={`${styles.ToastMessage} ${styles[type]}`}>
      <span>{message}</span>
      <progress className={styles.Progress} max="100"></progress>
    </div>
  );
});

export default ToastMessage;
