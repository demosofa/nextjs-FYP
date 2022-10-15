import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import useSWRInfinite from "swr/infinite";
import { expireStorage, retryAxios } from "../../utils";
import { dateFormat } from "../../shared";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { Loading } from "../../components";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function Notification({ className, ...props }) {
  const fetcher = async (config) => {
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    const response = await axios({
      ...config,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, error, size, setSize, mutate } = useSWRInfinite(
    (size) => ({
      url: `${LocalApi}/notify`,
      params: {
        page: size + 1,
      },
    }),
    fetcher,
    {
      onError(err, key, config) {
        if (err.status === 300) router.back();
        else if (err.status === 401) router.push("/login");
        else dispatch(addNotification({ message: err.message, type: "error" }));
      },
    }
  );
  console.log(data);
  const notifications = data ? [].concat(...data) : [];
  const handleRead = (index) => {
    mutate(async (data) => {
      try {
        await fetcher({
          url: `${LocalApi}/notify/${notifications[index]._id}`,
          method: "patch",
          data: null,
        });
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    });
  };
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  if (isLoadingInitialData) return <Loading />;
  return (
    <div className={`${className}`}>
      {notifications.length
        ? notifications.map((item, index) => (
            <div key={index} onClick={() => handleRead(item._id)} {...props}>
              <label>
                <span>from {item.from.username}</span>
                <span>at {dateFormat(item.createdAt)}</span>
              </label>
              <p>{item.content}</p>
            </div>
          ))
        : null}

      <button
        disabled={isLoadingMore || isReachingEnd}
        onClick={() => setSize(size + 1)}
      >
        {isLoadingMore
          ? "loading..."
          : isReachingEnd
          ? "no more notifications"
          : "load more"}
      </button>
    </div>
  );
}
