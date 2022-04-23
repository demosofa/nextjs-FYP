import { useState, useEffect, useRef } from "react";
import { Avatar } from "..";
import useAxiosLoad from "../../hooks/useAxiosLoad";

export default function Comment({
  baseURL = `https://jsonplaceholder.typicode.com/comments`,
}) {
  const [page, setPage] = useState(1);
  const [datas, setData] = useState([]);
  const unique = useRef(0);
  const [loading, axiosInstance] = useAxiosLoad(
    {
      headers: { "Content-Type": "application/json" },
      baseURL,
      method: "GET",
    },
    (data) => setData((prev) => [...prev, ...data]),
    [page]
  );

  return (
    <div className={styles.commentsContainer}>
      {datas.map((data) => {
        if (data.postId !== unique.current) {
          unique.current = data.postId;
          return (
            <CommentSection.Tab
              data={data}
              axiosInstance={axiosInstance}
            ></CommentSection.Tab>
          );
        }
      })}
      {loading && <div>Loading...</div>}
    </div>
  );
}

Comment.Tab = function CommentTab({ data, axiosInstance, ...props }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [editInput, setEditInput] = useState("");
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayReply, setDisplayReply] = useState(false);
  const [replys, setReply] = useState([]);

  useEffect(() => {
    const handleSetReply = async () => {
      try {
        setLoading(true);
        const newData = await axiosInstance
          .get("", {
            params: { postId: data.postId },
          })
          .then((response) => response.data);
        setReply(newData);
        setLoading(false);
      } catch (err) {
        return;
      }
    };
    if (toggle) handleSetReply();
  }, [toggle]);

  return (
    <div className={`${styles.tabContainer}`} {...props}>
      <Avatar
        size="40px"
        src="https://mkpcdn.com/1000x/d60c41360dca1d1aea52bae449c2b0ec_503970.jpg"
      ></Avatar>
      <button
        className={styles.toggle}
        onClick={() => setToggle((prev) => !prev)}
      >
        More
      </button>
      <div className={styles.tab}>
        {!openEdit ? (
          data.email
        ) : (
          <Comment.Input
            setDisplayInput={setOpenEdit}
            setInput={setEditInput}
          ></Comment.Input>
        )}
        <div className={styles.btnContainer}>
          <button
            className={styles.btnEdit}
            onClick={() => setOpenEdit((prev) => !prev)}
          >
            Edit
          </button>
          {displayReply || (
            <button
              className={styles.btnReply}
              onClick={() => setDisplayReply((prev) => !prev)}
            >
              Reply
            </button>
          )}
        </div>
      </div>
      {displayReply && (
        <Comment.Reply
          setDisplayReply={setDisplayReply}
          setReply={setReply}
          style={{ width: `calc(100% - 25px)`, marginLeft: "20px" }}
        ></Comment.Reply>
      )}
      {toggle && (
        <div className={styles.replysContainer}>
          {replys.map((reply) => {
            return (
              <Comment.Tab
                data={reply}
                style={{ width: `calc(100% - 25px)`, marginLeft: "30px" }}
              ></Comment.Tab>
            );
          })}
          {loading && <div>Loading...</div>}
        </div>
      )}
    </div>
  );
};

Comment.Input = function CommentInput({ setDisplayInput, setInput, ...props }) {
  const [value, setValue] = useState(``);

  const handleSubmit = () => {
    setInput((prev) => [...prev, value]);
    setDisplayInput((prev) => !prev);
  };
  return (
    <div className="comment-Input" {...props}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></input>
      <button className="btn submit" onClick={handleSubmit}></button>
      <button
        className="btn cancel"
        onClick={() => setDisplayInput((prev) => !prev)}
      >
        Cancel
      </button>
    </div>
  );
};

Comment.Reply = function CommentReply({ setDisplayReply, setReply, ...props }) {
  return (
    <div className="Reply" {...props}>
      <Avatar
        size="40px"
        src="https://mkpcdn.com/1000x/d60c41360dca1d1aea52bae449c2b0ec_503970.jpg"
      ></Avatar>
      <Comment.Input
        setDisplayInput={setDisplayReply}
        setInput={setReply}
      ></Comment.Input>
    </div>
  );
};
