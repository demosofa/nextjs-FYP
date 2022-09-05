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
import styles from "./featuredinfo.module.scss";
import { addNotification } from "../../redux/reducer/notificationSlice";

export default function FeaturedInfo({ children, url, ...props }) {
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
    if (response.data.length)
      setPerc((response.data[1].total * 100) / response.data[0].total - 100);
    return response.data;
  };
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, error } = useSWR({ url }, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onError(err, key, config) {
      if (err.status === 300) return router.back();
      else if (err.status === 401) return router.push("/login");
      else return dispatch(addNotification({ message: err.message }));
    },
  });

  return (
    <div className={`${styles.featuredItem}`} {...props}>
      <span className={`${styles.featuredTitle}`}>{children}</span>
      {data?.length ? (
        <div className={`${styles.featuredMoneyContainer}`}>
          <span className={`${styles.featuredMoney}`}>{data[1].total}</span>
          <span className={`${styles.featuredMoneyRate}`}>
            %{Math.floor(perc)}{" "}
            {perc < 0 ? (
              <HiOutlineArrowNarrowDown
                className={`${styles.featuredIcon} ${styles.negative}`}
              />
            ) : (
              <HiOutlineArrowNarrowUp className={`${styles.featuredIcon}`} />
            )}
          </span>
        </div>
      ) : (
        <div
          className="skeleton"
          style={{ height: "40px", width: "30%" }}
        ></div>
      )}
      <span className={`${styles.featuredSub}`}>Compare to last month</span>
    </div>
  );
}
