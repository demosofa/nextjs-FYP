import { useDispatch } from "react-redux";
import useSWRInfinite from "swr/infinite";
import { Loading } from "../../components";
import { fetcher } from "../../contexts/SWRContext";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { timeAgo } from "../../utils";

const LocalApi = process.env.NEXT_PUBLIC_API;
const PAGE_SIZE = 10;

export default function Notification({ className, ...props }) {
  const dispatch = useDispatch();
  const { isLoading, data, size, setSize, mutate } = useSWRInfinite((size) => ({
    url: `${LocalApi}/notify`,
    params: {
      page: size + 1,
      limit: PAGE_SIZE,
    },
  }));

  const notifications = data ? data.flat() : [];
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

  const handleDelete = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
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
    });
  };
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {!isLoading ? (
        notifications.map((item, index) => (
          <a
            href={item.link ?? ""}
            className="flex w-full flex-col gap-2 rounded-md p-2 text-gray-700 hover:shadow"
            key={index}
            onClick={(e) => {
              if (!item.link) e.preventDefault();
              handleRead(item._id);
            }}
            {...props}
          >
            <label className="font-semibold">
              From{" "}
              <span className="text-lg font-bold">{item.from.username}</span>
              <span className="text-gray-400"> {timeAgo(item.createdAt)}</span>
            </label>
            <p>{item.content}</p>
            <button
              className="rounded border border-solid border-orange-500 bg-transparent px-3 py-2 text-sm font-bold uppercase text-orange-500 outline-none transition-all duration-150 ease-linear hover:bg-orange-500 hover:text-white focus:outline-none active:bg-orange-600"
              onClick={(e) => handleDelete(e, index)}
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
