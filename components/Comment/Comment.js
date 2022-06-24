import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BiDotsVertical } from "react-icons/bi";
import { Avatar, Dropdown, Loading } from "../";
import { useAxiosLoad } from "../../hooks";
// import "./CommentSection.scss";

export default function Comment({
  url = `https://jsonplaceholder.typicode.com/comments`,
  params = ["postId", "id"],
}) {
  const datas = useRef();
  const unique = useRef();
  const [loading] = useAxiosLoad(
    {
      headers: { "Content-Type": "application/json" },
      baseURL: url,
      method: "GET",
    },
    (item) => (datas.current = item)
  );

  if (loading) return <Loading.Text />;
  return (
    <div className="comment-section">
      {datas.current.map((data, index) => {
        if (data.postId !== unique.current) {
          unique.current = data.postId;
          return (
            <CommentTab
              value={data}
              key={index}
              url={`${url}?${params[0]}=${data[params[0]]}`}
              params={params.slice(1)}
            />
          );
        }
        return undefined;
      })}
    </div>
  );
}

function CommentTab({ value, url, params, ...props }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(value);
  const [toggle, setToggle] = useState({
    edit: false,
    reply: false,
    more: false,
  });
  const [offDropdown, setOffDropdown] = useState(false);
  const comments = useRef([]);
  const controller = useRef();

  useEffect(() => {
    const abort = new AbortController();
    if (toggle.more) {
      setLoading(true);
      axios
        .get(url, { signal: abort.signal })
        .then((res) => (comments.current = res.data))
        .then(() => setLoading(false))
        .catch((error) => alert(error));
    }
    return () => abort.abort();
  }, [toggle.more]);

  const handleSave = (value) => {
    if (controller.current) controller.current.abort();
    else {
      controller.current = new AbortController();
      axios
        .put(url, { signal: controller.current.signal })
        .then(() =>
          setData((prev) => {
            return { ...prev, body: value };
          })
        )
        .then(() => setToggle((prev) => ({ ...prev, edit: false })))
        .catch((error) => alert(error));
    }
  };

  return (
    <div className="comments-container" {...props}>
      <div className="tab-container">
        <Avatar></Avatar>
        {!toggle.edit && (
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
            <div>Delete</div>
          </Dropdown>
        )}
      </div>
      <div className="comment-tab">
        {(toggle.edit && (
          <CommentInput
            data={data.body}
            callback={handleSave}
            setToggle={(boolean) =>
              setToggle((prev) => ({ ...prev, edit: boolean }))
            }
          />
        )) ||
          data.body}
      </div>
      <div className="btn-container">
        <button
          onClick={() =>
            setToggle((prev) => {
              if (params.length > 0)
                return { ...prev, reply: !prev.reply, more: true };
              return { ...prev, reply: !prev.reply };
            })
          }
        >
          Reply
        </button>
        {params.length > 0 && (
          <button
            onClick={() => setToggle((prev) => ({ ...prev, more: !prev.more }))}
          >
            More
          </button>
        )}
      </div>
      {loading && <Loading.Text />}
      {comments.current.length > 0 && toggle.more && (
        <div className="replys-container">
          {comments.current.map((comment, index) => {
            return (
              <CommentTab
                key={index}
                value={comment}
                url={`${url}&${params[0]}=${comment[params[0]]}`}
                params={params.slice(1)}
              />
            );
          })}
        </div>
      )}
      {toggle.reply && (
        <CommentReply
          url={url}
          setToggle={(boolean) =>
            setToggle((prev) => ({ ...prev, reply: boolean }))
          }
        />
      )}
    </div>
  );
}

function CommentInput({ data, callback, setToggle }) {
  const [input, setInput] = useState(data);

  return (
    <div className="edit-container">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={() => callback(input)}>Save</button>
        <button onClick={() => setToggle(false)}>Cancel</button>
      </div>
    </div>
  );
}

function CommentReply({ url, setToggle }) {
  const [reply, setReply] = useState();
  const controller = useRef();

  const handleReply = (value) => {
    if (controller.current) controller.current.abort();
    else {
      controller.current = new AbortController();
      axios
        .post(url, { signal: controller.current.signal })
        .then(() => setReply(value))
        .then(() => setToggle(false))
        .catch((error) => alert(error));
    }
  };

  return (
    <div className="reply-comment">
      <Avatar></Avatar>
      <CommentInput data={reply} callback={handleReply} setToggle={setToggle} />
    </div>
  );
}
