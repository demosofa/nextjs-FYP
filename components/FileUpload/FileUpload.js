import {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Children,
} from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Animation } from "../";
import styles from "./FileUpload.module.css";

const Kits = createContext();

export default function FileUpload({
  prevFiles = [],
  setPrevFiles = new Function(),
  children,
  ...props
}) {
  const [files, setFiles] = useState(prevFiles);

  return (
    <Kits.Provider value={{ files, setFiles, setPrevFiles }}>
      <div className={styles.drop_zone} {...props}>
        {Children.toArray(children).map((child) => child)}
      </div>
    </Kits.Provider>
  );
}

FileUpload.Input = function InputUpload({ children, ...props }) {
  const { setFiles } = useContext(Kits);
  const handleInput = (e) => {
    setFiles((prev) => [...prev, ...e.target.files]);
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
  const { setFiles } = useContext(Kits);
  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFiles((prev) => [...prev, ...e.dataTransfer.files]);
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
