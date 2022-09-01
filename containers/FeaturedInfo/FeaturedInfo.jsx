import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { Loading } from "../../components";
import { convertTime, expireStorage, retryAxios } from "../../utils";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
} from "react-icons/hi";
import styles from "./featuredinfo.module.scss";
import { addNotification } from "../../redux/reducer/notificationSlice";

export default function FeaturedInfo({ url }) {
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
    setPerc((response.data[1].total * 100) / response.data[0].total - 100);
    return response.data;
  };
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, error } = useSWR({ url }, fetcher, {
    onError(err, key, config) {
      if (err.status === 300) return router.back();
      else if (err.status === 401) return router.push("/login");
      else return dispatch(addNotification({ message: err }));
    },
  });

  if (!data || error)
    return (
      <Loading
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%)`,
        }}
      ></Loading>
    );
  return (
    <div className={`${styles.featuredItem}`}>
      <span className={`${styles.featuredTitle}`}>Revenue</span>
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
      <span className={`${styles.featuredSub}`}>Compare to last month</span>
    </div>
  );
}
