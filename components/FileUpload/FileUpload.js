import {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Children,
  useCallback,
} from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Animation, Loading } from "../";
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
  const [files, setFiles] = useState(prevFiles);

  const isOverSize = (currentFiles, newFile) => {
    const maxMB = maxByMB * 1024 * 1024;
    let futureSize = currentFiles.reduce(
      (prev, curr) => prev + curr.size,
      newFile.size
    );
    if (maxMB >= futureSize) return false;
    return true;
  };

  const isExist = (currentFiles, newFile) => {
    const index = currentFiles.findIndex((file) => file.name === newFile.name);
    if (index === -1) return false;
    return true;
  };

  const getFiles = useCallback(
    (newFiles) => {
      let length = Math.min(limitFiles - files.length, newFiles.length);
      for (var i = 0; i < length; i++) {
        setFiles((prev) => {
          let currentFile = newFiles[i];
          if (!isOverSize(prev, currentFile) && !isExist(prev, currentFile))
            return [...prev, currentFile];
          return prev;
        });
      }
    },
    [files]
  );

  useEffect(() => {
    setPrevFiles(files);
  }, [files]);

  return (
    <Kits.Provider value={{ files, setFiles, getFiles }}>
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
  const { files, setFiles } = useContext(Kits);
  const run = useRef(true);
  const Animate = useRef(Animation[animate]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpenPreview = (e, index) => {
    e.stopPropagation();
    if (e.detail > 1) {
      const popup = window.open("", files[index].name);
      popup.document.write(
        `<iframe src="${previews[index]}" frameborder="0" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"/>`
      );
      popup.document.close();
    }
  };

  const handleDelete = (e, index) => {
    e.stopPropagation();
    run.current = false;
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleFile = (file) => {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.onerror = () => {
        reject(fr.onerror);
      };
    });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all(files.map((item) => handleFile(item)))
      .then((files) => run.current && setPreviews(files))
      .then(() => setLoading(false))
      .then(() => (run.current = true));
  }, [files]);

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
              style={{ width: "100%", height: "100%" }}
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
