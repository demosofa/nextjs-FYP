import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useRef, Fragment } from "react";
import { useDispatch } from "react-redux";
import { Checkbox, Loading } from "../../components";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { expireStorage, retryAxios } from "../../utils";
import styles from "./rating.module.scss";

export default function Rating({ url }) {
  const arrStar = useRef(
    [...Array.from({ length: 5 }, (_, i) => i + 1)].reverse()
  );
  const fetcher = async (config) => {
    const accessToken = expireStorage.getItem("accessToken");
    if (accessToken) {
      retryAxios(axios);
      const response = await axios({
        ...config,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.data) return { _id: "", rating: 0 };
      return response.data;
    }
    return { _id: "", rating: 0 };
  };
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, error, mutate } = useSWR({ url }, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onError(err, key, config) {
      if (err.status === 300) return router.back();
      else if (err.status === 401) return router.push("/login");
      else return dispatch(addNotification({ message: err.message }));
    },
  });

  const handleRating = async (rating) => {
    const accessToken = expireStorage.getItem("accessToken");
    if (rating !== data?.rating && accessToken)
      mutate(async (data) => {
        retryAxios(axios);
        try {
          await axios.put(
            url,
            { rating },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          data.rating = rating;
          return data;
        } catch (error) {
          dispatch(addNotification({ message: error.message }));
          return data;
        }
      });
  };

  if (!data || error) return <Loading.Text />;
  return (
    <Checkbox
      type="radio"
      name="rating"
      className={styles.rate}
      checked={[data?.rating]}
      setChecked={(data) => {
        handleRating(data[0]);
      }}
    >
      {arrStar.current.map((star) => {
        return (
          <Fragment key={star}>
            <Checkbox.Item
              className={styles.star}
              value={star}
              id={"star-rating_" + star}
            >
              <label htmlFor={"star-rating_" + star}></label>
            </Checkbox.Item>
            <Checkbox.Item
              className={styles.star}
              value={star - 0.5}
              id={"star-rating_" + star + "-and-half"}
            >
              <label
                className={styles.half}
                htmlFor={"star-rating_" + star + "-and-half"}
              ></label>
            </Checkbox.Item>
          </Fragment>
        );
      })}
    </Checkbox>
  );
}
