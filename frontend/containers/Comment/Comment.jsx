import decoder from "jwt-decode";
import { useMemo, useRef, useState } from "react";
import { BiDotsVertical } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Role } from "../../../shared";
import { Dropdown, Loading, Pagination } from "../../components";
import { fetcher } from "../../contexts/SWRContext";
import { useAuthLoad, useAxiosLoad } from "../../hooks";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { expireStorage, timeAgo } from "../../utils";
import styles from "./comment.module.scss";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function Comment({ url, maxTree = 3 }) {
  const [params, setParams] = useState({
    page: 1,
  });
  const [pageCounted, setPageCounted] = useState(1);
  const [comments, setComments] = useState();
  const controller = useRef();
  const dispatch = useDispatch();
  const { loading } = useAxiosLoad({
    config: {
      headers: { "Content-Type": "application/json" },
      baseURL: url,
      params,
    },
    callback: async (axiosInstance) => {
      const { comments, pageCounted } = (await axiosInstance()).data;
      setComments(comments);
      setPageCounted(pageCounted);
    },
    deps: [params],
  });

  const handleAddComment = async (content) => {
    if (controller.current) controller.current.abort();
    else {
      controller.current = new AbortController();
      try {
        const data = await fetcher({
          url,
          method: "post",
          data: { content },
          signal: controller.current.signal,
        });
        setComments((prev) => [data, ...prev]);
        controller.current = null;
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    }
  };

  if (loading) return <Loading.Text />;
  return (
    <div className={styles.wrapper}>
      {localStorage.getItem("accessToken") ? (
        <CommentInput callback={handleAddComment} />
      ) : null}
      <div className={styles.section}>
        {comments.map((comment) => (
          <CommentTab
            key={comment.updatedAt}
            data={comment}
            maxTree={maxTree - 1}
            parentCommentId={comment._id}
            setDelete={() =>
              setComments((prev) =>
                prev.filter((item) => item._id !== comment._id)
              )
            }
          />
        ))}
      </div>
      <Pagination
        className="flex justify-end"
        totalPageCount={pageCounted}
        currentPage={params.page}
        setCurrentPage={(page) => setParams((prev) => ({ ...prev, page }))}
      >
        <Pagination.Number />
      </Pagination>
    </div>
  );
}

function CommentTab({
  data,
  maxTree,
  parentCommentId,
  setParentSubComments,
  setDelete,
  ...props
}) {
  const [currentComment, setCurrentComment] = useState(data);
  const [toggle, setToggle] = useState({
    edit: false,
    reply: false,
    more: false,
  });
  const isAuthor = useState(() => {
    const accessToken = expireStorage.getItem("accessToken");
    if (!accessToken) return false;
    const { accountId } = decoder(accessToken);
    return accountId === data.author._id;
  })[0];
  const [comments, setComments] = useState([]);
  const controller = useRef();
  const dispatch = useDispatch();

  const handleEditSave = async (content) => {
    if (controller.current) controller.current.abort();
    else {
      controller.current = new AbortController();
      try {
        const result = await fetcher({
          url: `${LocalApi}/comments/${data._id}`,
          method: "patch",
          data: { content },
          signal: controller.current.signal,
        });
        setCurrentComment((prev) => ({
          ...prev,
          content,
          updatedAt: result.updatedAt,
        }));
        setToggle((prev) => ({ ...prev, edit: false }));
        controller.current = null;
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    }
  };

  const handleDelete = async () => {
    if (controller.current) controller.current.abort();
    else {
      controller.current = new AbortController();
      try {
        await fetcher({
          url: `${LocalApi}/comments/${data._id}`,
          method: "delete",
          signal: controller.current.signal,
        });
        setDelete();
        controller.current = null;
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    }
  };

  const { loading } = useAuthLoad({
    async callback(axiosInstance) {
      if (toggle.more) {
        const response = await axiosInstance({
          url: `${LocalApi}/comments/${currentComment._id}`,
        });
        setComments(response.data);
      }
    },
    roles: [Role.admin, Role.customer, Role.manager, Role.seller, Role.shipper],
    deps: [toggle.more],
  });

  return (
    <div className={styles.container} {...props}>
      <div className={styles.tab_container}>
        <p>
          <span className="text-base font-bold">
            {currentComment.author.username}
          </span>{" "}
          <span className="text-sm text-gray-500 ">
            {timeAgo(currentComment.updatedAt)}
          </span>
        </p>

        {isAuthor && !toggle.edit && (
          <Dropdown component={<BiDotsVertical />} hoverable={true}>
            <Dropdown.Content className="right-0">
              <div
                className="text-black hover:bg-orange-400 hover:text-white"
                onClick={() =>
                  setToggle((prev) => ({ ...prev, edit: !prev.edit }))
                }
              >
                Edit
              </div>
              <div
                className="text-black hover:bg-orange-400 hover:text-white"
                onClick={handleDelete}
              >
                Delete
              </div>
            </Dropdown.Content>
          </Dropdown>
        )}
      </div>
      <div className="comment-tab">
        {toggle.edit ? (
          <CommentInput
            data={currentComment.content}
            callback={handleEditSave}
            setToggle={(boolean) =>
              setToggle((prev) => ({ ...prev, edit: boolean }))
            }
          />
        ) : (
          <p className="text-gray-700">{currentComment.content}</p>
        )}
      </div>
      <div className="btn-container">
        <button
          className="background-transparent mr-1 mb-1 px-3 py-1 text-xs font-bold uppercase text-blue-500 outline-none transition-all duration-150 ease-linear hover:underline focus:outline-none"
          onClick={() =>
            setToggle((prev) => {
              if (maxTree > 0)
                return { ...prev, reply: !prev.reply, more: true };
              return { ...prev, reply: !prev.reply };
            })
          }
        >
          Reply
        </button>
        {maxTree > 0 && (
          <button
            className="background-transparent mr-1 mb-1 px-3 py-1 text-xs font-bold uppercase text-blue-500 outline-none transition-all duration-150 ease-linear hover:underline focus:outline-none"
            onClick={() => setToggle((prev) => ({ ...prev, more: !prev.more }))}
          >
            More
          </button>
        )}
      </div>
      {loading && <Loading.Text />}
      {comments.length > 0 && toggle.more && (
        <div className={styles.replys_container}>
          {comments.map((comment) => (
            <CommentTab
              key={comment.updatedAt}
              data={comment}
              maxTree={maxTree - 1}
              parentCommentId={maxTree > 0 ? comment._id : currentComment._id}
              setParentSubComments={
                maxTree > 0 ? setComments : setParentSubComments
              }
              setDelete={() => {
                if (maxTree > 0)
                  setComments((prev) =>
                    prev.filter((item) => item._id !== comment._id)
                  );
                else
                  setParentSubComments((prev) =>
                    prev.filter((item) => item._id !== comment._id)
                  );
              }}
            />
          ))}
        </div>
      )}
      {toggle.reply && (
        <CommentReply
          data={currentComment}
          urlWithParentCommentId={`${LocalApi}/comments/${parentCommentId}`}
          setComments={maxTree > 0 ? setComments : setParentSubComments}
          setToggle={(boolean) =>
            setToggle((prev) => ({ ...prev, reply: boolean }))
          }
        />
      )}
    </div>
  );
}

function CommentInput({ data = "", callback, setToggle = undefined }) {
  const [input, setInput] = useState(data);

  return (
    <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50">
      <div className="rounded-t-lg bg-white py-2 px-4">
        <textarea
          className="w-full resize-none border-0 bg-white px-0 text-sm text-gray-900 focus:ring-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end gap-4 border-t py-2 px-3">
        {setToggle && (
          <button
            className="font-medium text-orange-500 underline hover:text-orange-700"
            onClick={() => setToggle(false)}
          >
            Cancel
          </button>
        )}
        <button
          className="mr-2 mb-2 rounded-lg bg-gradient-to-r from-red-400 via-red-500 to-red-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-red-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-red-300 dark:shadow-lg dark:shadow-red-800/80 dark:focus:ring-red-800"
          onClick={() => {
            callback(input);
            setInput("");
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function CommentReply({
  data,
  urlWithParentCommentId,
  setComments,
  setToggle,
}) {
  const controller = useRef();
  const dispatch = useDispatch();
  const { username } = useMemo(() => {
    const accessToken = expireStorage.getItem("accessToken");
    return decoder(accessToken);
  }, []);

  const handleReply = async (value) => {
    if (controller.current) controller.current.abort();
    else {
      controller.current = new AbortController();
      try {
        const result = await fetcher({
          url: urlWithParentCommentId,
          method: "put",
          data: { content: value },
          signal: controller.current.signal,
        });
        await fetcher({
          url: `${LocalApi}/notify`,
          method: "post",
          data: {
            to: data.author._id,
            content: `You have an reply from ${username}`,
            link: window.location.href,
          },
        });
        setComments((prev) => [result, ...prev]);
        setToggle(false);
        controller.current = null;
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    }
  };

  return (
    <div className="reply-comment">
      <label className="text-sm font-bold">{username}</label>
      <CommentInput callback={handleReply} setToggle={setToggle} />
    </div>
  );
}
