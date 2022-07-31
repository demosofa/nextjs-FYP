import { createContext, useContext, useRef, Children, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Animation, Loading } from "../";
import { useUpload } from "../../hooks";
import styles from "./FileUpload.module.css";

const Kits = createContext();

export default function FileUpload({
  prevFiles = [],
  setPrevFiles = new Function(),
  limitFiles = 10,
  maxByMB = 5,
  children,
  ...props
}) {
  const {
    loading,
    previews,
    files,
    getFiles,
    handleDelete,
    handleOpenPreview,
  } = useUpload(prevFiles, {
    total: limitFiles,
    size: maxByMB,
  });

  useEffect(() => setPrevFiles(files, previews), [files]);

  return (
    <Kits.Provider
      value={{
        loading,
        files,
        previews,
        getFiles,
        handleDelete,
        handleOpenPreview,
      }}
    >
      <div className={styles.drop_zone} {...props}>
        {Children.toArray(children).map((child) => child)}
      </div>
    </Kits.Provider>
  );
}

FileUpload.Input = function InputUpload({ children, ...props }) {
  const { getFiles } = useContext(Kits);
  const handleInput = (e) => {
    e.stopPropagation();
    getFiles(e.target.files);
  };
  return (
    <>
      <input
        type="file"
        onChange={handleInput}
        onClick={(event) => {
          event.target.value = null;
        }}
        {...props}
      ></input>
      {children}
    </>
  );
};

FileUpload.Drag = function DragUpload({ children, ...props }) {
  const { getFiles } = useContext(Kits);
  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    getFiles(e.dataTransfer.files);
  };

  const allowDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      className={styles.input_file}
      onDrop={handleDrop}
      onDragOver={allowDrop}
      {...props}
    >
      {children}
    </div>
  );
};

FileUpload.Show = function ShowFiles({ children, animate = "Fade", ...props }) {
  const { loading, previews, files, handleDelete, handleOpenPreview } =
    useContext(Kits);
  const Animate = useRef(Animation[animate]);

  return (
    <>
      {loading && (
        <div className={styles.hero}>
          <Loading />
        </div>
      )}
      <Animate.current className={styles.preview} {...props}>
        {previews.map((preview, index) => {
          return (
            <div
              key={files[index].name}
              style={{ width: "100%" }}
              onClick={(e) => handleOpenPreview(e, index)}
            >
              <div className={styles.img_container}>
                <img
                  alt="Preview"
                  src={preview.includes("image") ? preview : ""}
                ></img>
                <AiOutlineClose
                  onClick={(e) => handleDelete(e, index)}
                  onMouseEnter={(e) =>
                    (e.target.parentElement.style.opacity = 0.8)
                  }
                  onMouseLeave={(e) =>
                    (e.target.parentElement.style.opacity = 1)
                  }
                ></AiOutlineClose>
              </div>
              <span>{files[index].name}</span>
            </div>
          );
        })}
      </Animate.current>
      {children}
    </>
  );
};
