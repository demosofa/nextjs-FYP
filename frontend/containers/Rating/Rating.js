import axios from "axios";
import useSWRImmutable from "swr/immutable";
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
  const { data, error, mutate } = useSWRImmutable({ url }, fetcher);

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
  return (
    <StarRating value={data.rating} handleRating={handleRating} size="2rem" />
  );
}
