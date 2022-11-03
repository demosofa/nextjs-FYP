import { useSelector } from "react-redux";
import { Animation, ToastMessage } from "../../components";
import styles from "./notifytoast.module.scss";

export default function NotifyToast({ ...props }) {
  const notifications = useSelector((state) => state.notification);
  return (
    <div className={styles.container} {...props}>
      <Animation.Move reverse={false}>
        {notifications.map((item) => (
          <ToastMessage key={item.id} {...item} />
        ))}
      </Animation.Move>
    </div>
  );
}
