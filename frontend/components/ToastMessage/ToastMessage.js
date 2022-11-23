import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeNotification } from "../../redux/reducer/notificationSlice";
import Icon from "../Icon/Icon";
import {
  BsCheckCircleFill,
  BsFillExclamationTriangleFill,
  BsExclamationOctagonFill,
} from "react-icons/bs";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import styles from "./ToastMessage.module.css";
import { convertTime } from "../../../shared";

export default function ToastMessage({
  id,
  type = "success",
  message,
  timeout = "5s",
  ...props
}) {
  const ToastRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    ToastRef.current.style.opacity = 1;
    const timeOut = setTimeout(() => {
      clearTimeout(timeOut);
      dispatch(removeNotification(id));
    }, convertTime(timeout).milisecond);
    return () => {
      clearTimeout(timeOut);
    };
  }, [timeout, id]);
  return (
    <a ref={ToastRef} className={`${styles.toast_message}`} {...props}>
      <div>
        <Icon>
          {(type === "success" && <BsCheckCircleFill color="green" />) ||
            (type === "warning" && (
              <BsFillExclamationTriangleFill color="yellow" />
            )) ||
            (type === "error" && <BsExclamationOctagonFill color="red" />) ||
            (type === "link" && <FaExternalLinkSquareAlt color="blue" />)}
        </Icon>
        <span>{message}</span>
      </div>
      <Icon
        className="rounded-full hover:bg-gray-300"
        onClick={() => dispatch(removeNotification(id))}
      >
        <RiCloseFill scale={20} />
      </Icon>
    </a>
  );
}
