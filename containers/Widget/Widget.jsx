import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { expireStorage, retryAxios } from "../../utils";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
} from "react-icons/hi";
import styles from "./widget.module.scss";
import { addNotification } from "../../redux/reducer/notificationSlice";

export default function Widget({
  children,
  url,
  description,
  className,
  ...props
}) {
  const [perc, setPerc] = useState();
  const fetcher = async (config) => {
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    const response = await axios({
      ...config,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.data.length > 1) {
      setPerc((response.data[1].total * 100) / response.data[0].total - 100);
    }
    return response.data;
  };
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, error } = useSWR({ url }, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onError(err, key, config) {
      if (err.status === 300) router.back();
      else if (err.status === 401) router.push("/login");
      else dispatch(addNotification({ message: err.message, type: "error" }));
    },
  });

  return (
    <div className={`${styles.widgetItem} ${className}`} {...props}>
      <span className={`${styles.widgetTitle}`}>{children}</span>
      {data?.length > 1 ? (
        <div className={`${styles.widgetNumberContainer}`}>
          <span className={`${styles.widgetNumber}`}>{data[1].total}</span>
          <span className={`${styles.widgetNumberRate}`}>
            %{Math.floor(perc)}{" "}
            {perc < 0 ? (
              <HiOutlineArrowNarrowDown
                className={`${styles.widgetIcon} ${styles.negative}`}
              />
            ) : (
              <HiOutlineArrowNarrowUp className={`${styles.widgetIcon}`} />
            )}
          </span>
        </div>
      ) : (
        <div className="skeleton h-10 w-[30%]" />
      )}
      <span className={`${styles.widgetSub}`}>{description}</span>
    </div>
  );
}
