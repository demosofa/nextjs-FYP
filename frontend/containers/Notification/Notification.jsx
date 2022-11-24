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
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {!isLoadingInitialData ? (
        notifications.map((item, index) => (
          <a
            href={item.link}
            className="w-full rounded-md p-2 text-gray-700 hover:shadow"
            key={index}
            onClick={(e) => {
              if (!item.link) e.preventDefault();
              handleRead(item._id);
            }}
            {...props}
          >
            <label>
              From <span className="text-base">{item.from.username}</span>
            </label>
            <label className="text-gray-400">
              {" "}
              at {timeAgo(item.createdAt)}
            </label>
            <p>{item.content}</p>
            <button
              className="mt-1 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              onClick={() => handleDelete(index)}
            >
              Delete
            </button>
          </a>
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
