import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Loading, StarRating } from "../../components";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { expireStorage, retryAxios } from "../../utils";

export default function Rating({ url }) {
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
      if (err.status === 300) router.back();
      else if (err.status === 401) router.push("/login");
      else dispatch(addNotification({ message: err.message, type: "error" }));
    },
  });

  const handleRating = async (rating) => {
    mutate(async (data) => {
      try {
        await fetcher({ url, method: "put", data: { rating } });
        data.rating = rating;
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    }, false);
  };

  if (!data || error) return <Loading.Text />;
  return <StarRating value={data.rating} handleRating={handleRating} />;
}
