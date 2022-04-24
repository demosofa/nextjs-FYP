import { useState, useEffect, useRef } from "react";
import { GrFormClose } from "react-icons/gr";
import style from "./TagsInput.module.css";

export default function TagsInput({ filter, forParent }) {
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [active, setActive] = useState(false);
  const filtered = useRef([...filter]);
  let inputDiv;

  useEffect(() => {
    forParent(tags);
  }, [tags, forParent]);

  const handleDelete = (index) => {
    setTags(tags.filter((tag) => tag !== tags[index]));
  };

  const handleFilter = (value) => {
    filtered.current = filter.filter((data) =>
      data.toUpperCase().includes(value.toUpperCase())
    );
    setText(value);
  };

  const handleInput = (e) => {
    if (e.key === "Enter") {
      if (!tags.includes(text))
        setTags((prev) => {
          return [...prev, text];
        });
      handleFilter("");
      e.target.focus();
    }
  };

  return (
    <div className={style.container}>
      {tags.map((tag, index) => {
        return (
          <div key={index} className={style.tag}>
            {tag}
            <GrFormClose onClick={() => handleDelete(index)}></GrFormClose>
          </div>
        );
      })}
      <div className={style.searchbox}>
        <input
          ref={(e) => {
            if (e !== null) inputDiv = e;
          }}
          placeholder="input your tags"
          value={text}
          onChange={(e) => {
            handleFilter(e.target.value);
            setActive(true);
          }}
          onKeyDown={handleInput}
        ></input>
        <button
          onClick={() => {
            handleFilter("");
            setActive((prev) => !prev);
          }}
        ></button>
        {active && (
          <div className={style.dropdown}>
            {filtered.current.map((target, index) => (
              <div
                key={index}
                className={style.target}
                onClick={(e) => {
                  handleFilter(e.target.innerText);
                  inputDiv.focus();
                }}
              >
                {target}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
