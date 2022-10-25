import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import useSWRInfinite from "swr/infinite";
import { expireStorage, retryAxios, timeAgo } from "../../utils";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { Loading } from "../../components";

const LocalApi = process.env.NEXT_PUBLIC_API;
const PAGE_SIZE = 10;

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
        limit: PAGE_SIZE,
      },
    }),
    fetcher,
    {
      onError(err, key, config) {
        if (err?.response?.status === 403) router.back();
        else if (err?.response?.status === 401) router.push("/login");
        else dispatch(addNotification({ message: err.message, type: "error" }));
      },
    }
  );

  const notifications = data ? [].concat(...data) : [];
  const handleRead = (Id) => {
    mutate(async (data) => {
      try {
        await fetcher({
          url: `${LocalApi}/notify/${Id}`,
          method: "patch",
          data: null,
        });
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    });
  };

  const handleDelete = (index) => {
    mutate(async (data) => {
      try {
        await fetcher({
          url: `${LocalApi}/notify/${notifications[index]._id}`,
          method: "delete",
        });
        data.splice(index, 1);
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    }, false);
  };

  const isLoadingInitialData = (!data && !error) || error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  return (
    <div>
      {!isLoadingInitialData ? (
        notifications.map((item, index) => (
          <div
            className="w-full text-gray-700 hover:shadow-md"
            key={index}
            onClick={() => handleRead(item._id)}
            {...props}
          >
            <label>
              from{" "}
              <span className="text-base font-medium">
                {item.from.username}
              </span>
            </label>
            <label>
              {" "}
              at{" "}
              <span className="text-base font-medium">
                {timeAgo(item.createdAt)}
              </span>
            </label>
            <p>{item.content}</p>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </div>
        ))
      ) : (
        <Loading.Spinner />
      )}

      <button
        className="text-black"
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
