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
import { Animation } from "../";
import styles from "./FileUpload.module.css";

const Kits = createContext();

export default function FileUpload({
  prevFiles = [],
  setPrevFiles = new Function(),
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
      for (var i = 0; i < newFiles.length; i++) {
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

  return (
    <Kits.Provider value={{ files, setFiles, setPrevFiles, getFiles }}>
      <div className={styles.drop_zone} {...props}>
        {Children.toArray(children).map((child) => child)}
      </div>
    </Kits.Provider>
  );
}

FileUpload.Input = function InputUpload({ children, ...props }) {
  const { getFiles } = useContext(Kits);
  const handleInput = (e) => {
    getFiles(e.target.files);
  };
  return (
    <div className={styles.input_file}>
      <input
        type="file"
        onChange={handleInput}
        onClick={(event) => {
          event.target.value = null;
        }}
        multiple
        {...props}
      ></input>
      {children}
    </div>
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

FileUpload.Show = function ShowFiles({ children, ...props }) {
  const { files, setFiles, setPrevFiles } = useContext(Kits);
  const run = useRef(true);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpenPreview = (e, index) => {
    if (e.detail > 1) {
      const popup = window.open("", files[index].name);
      popup.document.write(`<iframe src="${previews[index]}"/>`);
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
        resolve(fr.result, file);
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
    setPrevFiles(files);
  }, [files]);

  return (
    <div className={styles.show_file} {...props}>
      {loading && <div>Loading....</div>}
      <Animation.Fade>
        {previews.map((preview, index) => {
          return (
            <div
              key={files[index].name}
              className={styles.preview}
              onClick={(e) => handleOpenPreview(e, index)}
            >
              <span>{files[index].name}</span>
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
            </div>
          );
        })}
      </Animation.Fade>
    </div>
  );
};
