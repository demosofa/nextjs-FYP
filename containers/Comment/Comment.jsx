import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BiDotsVertical } from "react-icons/bi";
import { Avatar, Dropdown, Loading } from "../../components";
import { useAxiosLoad } from "../../hooks";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { expireStorage, retryAxios } from "../../utils";
import decoder from "jwt-decode";
import styles from "./comment.module.scss";
import pusherJs from "pusher-js";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API + "/comments";

export default function Comment({ url, maxTree = 3 }) {
  const [params, setParams] = useState({
    page: 1,
  });
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
      setComments((await axiosInstance()).data);
    },
  });

  const handleAddComment = async (content) => {
    if (controller.current) controller.current.abort();
    else {
      controller.current = new AbortController();
      const accessToken = expireStorage.getItem("accessToken");
      retryAxios(axios);
      try {
        const response = await axios.post(
          url,
          { content },
          {
            signal: controller.current.signal,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setComments((prev) => [response.data, ...prev]);
        controller.current = null;
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
      }
    }
  };

  if (loading) return <Loading.Text />;
  return (
    <div className={styles.wrapper}>
      <CommentInput callback={handleAddComment}></CommentInput>
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
    const { accountId } = decoder(accessToken);
    return accountId === data.author._id;
  })[0];
  const [offDropdown, setOffDropdown] = useState(false);
  const [comments, setComments] = useState([]);
  const controller = useRef();
  const dispatch = useDispatch();

  console.log(maxTree);
  console.log(parentCommentId);

  const handleEditSave = async (content) => {
    if (controller.current) controller.current.abort();
    else {
      controller.current = new AbortController();
      retryAxios(axios);
      const accessToken = expireStorage.getItem("accessToken");
      try {
        await axios.patch(
          `${LocalApi}/${data._id}`,
          { content },
          {
            signal: controller.current.signal,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCurrentComment((prev) => ({ ...prev, content }));
        setToggle((prev) => ({ ...prev, edit: false }));
        controller.current = null;
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
      }
    }
  };

  const handleDelete = async () => {
    if (controller.current) controller.current.abort();
    else {
      controller.current = new AbortController();
      retryAxios(axios);
      const accessToken = expireStorage.getItem("accessToken");
      try {
        await axios.delete(`${LocalApi}/${data._id}`, {
          signal: controller.current.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDelete();
        controller.current = null;
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
      }
    }
  };

  const { loading } = useAxiosLoad({
    async callback(axiosInstance) {
      if (toggle.more) {
        retryAxios(axiosInstance);
        const accessToken = expireStorage.getItem("accessToken");
        const response = await axiosInstance({
          url: `${LocalApi}/${currentComment._id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setComments(response.data);
      }
    },
    deps: [toggle.more],
  });

  // useEffect(() => {
  //   const pusher = new pusherJs(process.env.NEXT_PUBLIC_key, {
  //     cluster: process.env.NEXT_PUBLIC_cluster,
  //   });
  //   console.log(parentCommentId);
  //   const channel = pusher.subscribe(`reply-to-${parentCommentId}`);
  //   channel.bind("reply", function (data) {
  //     dispatch(addNotification({ message: data.message }));
  //   });
  //   return () => {
  //     pusher.unsubscribe(`reply-to-${parentCommentId}`);
  //   };
  // }, []);

  return (
    <div className={styles.container} {...props}>
      <div className={styles.tab_container}>
        <Avatar text={currentComment.author.username}></Avatar>
        {isAuthor && !toggle.edit && (
          <Dropdown
            icon={<BiDotsVertical />}
            toggle={offDropdown}
            setToggle={setOffDropdown}
            onMouseLeave={() => setOffDropdown(false)}
          >
            <div
              onClick={() =>
                setToggle((prev) => ({ ...prev, edit: !prev.edit }))
              }
            >
              Edit
            </div>
            <div onClick={handleDelete}>Delete</div>
          </Dropdown>
        )}
      </div>
      <div className="comment-tab">
        {(toggle.edit && (
          <CommentInput
            data={currentComment.content}
            callback={handleEditSave}
            setToggle={(boolean) =>
              setToggle((prev) => ({ ...prev, edit: boolean }))
            }
          />
        )) ||
          currentComment.content}
      </div>
      <div className="btn-container">
        <button
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
          urlWithParentCommentId={`${LocalApi}/${parentCommentId}`}
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
    <div className="edit-container">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={() => callback(input)}>Save</button>
        {setToggle && <button onClick={() => setToggle(false)}>Cancel</button>}
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

  const handleReply = async (value) => {
    if (controller.current) controller.current.abort();
    else {
      controller.current = new AbortController();
      const accessToken = expireStorage.getItem("accessToken");
      retryAxios(axios);
      try {
        const response = await axios.put(
          urlWithParentCommentId,
          { content: value },
          {
            signal: controller.current.signal,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setComments((prev) => [response.data, ...prev]);
        setToggle(false);
        controller.current = null;
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
      }
    }
  };

  return (
    <div className="reply-comment">
      <Avatar text={data.author.username}></Avatar>
      <CommentInput callback={handleReply} setToggle={setToggle} />
    </div>
  );
}
