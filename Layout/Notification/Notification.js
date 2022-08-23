import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastMessage } from "../../components";
import { addNotification } from "../../redux/reducer/notificationSlice";
import socket from "../../utils/socketClient";
import styles from "./notification.module.scss";

export default function notification({ ...props }) {
  const notifications = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on("notify", (data) => {
      dispatch(addNotification({ message: data }));
    });
    return () => socket.disconnect();
  }, [socket]);
  return (
    <div className={styles.container} {...props}>
      {notifications.map((item) => {
        return (
          <ToastMessage
            key={item.id}
            id={item.id}
            message={item.message}
            timeout={10000}
          />
        );
      })}
    </div>
  );
}
