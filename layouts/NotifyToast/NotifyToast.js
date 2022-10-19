import { useSelector } from "react-redux";
import { ToastMessage } from "../../components";
import styles from "./notifytoast.module.scss";

export default function NotifyToast({ ...props }) {
  const notifications = useSelector((state) => state.notification);
  return (
    <div className={styles.container} {...props}>
      {notifications.map((item) => {
        return <ToastMessage key={item.id} {...item} />;
      })}
    </div>
  );
}
