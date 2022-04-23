import {
  useState,
  useLayoutEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./FileUpload.module.css";

const Kits = createContext();

export default function FileUpload({
  prevFiles = [],
  setPrevFiles = new Function(),
  children,
  ...props
}) {
  const [files, setFiles] = useState(prevFiles);
  const run = useRef(true);

  return (
    <Kits.Provider value={{ files, setFiles, setPrevFiles, run }}>
      <div className={styles.drop_zone} {...props}>
        {children}
      </div>
    </Kits.Provider>
  );
}

FileUpload.Input = function InputUpload({ children, ...props }) {
  const { setFiles, run } = useContext(Kits);
  const handleInput = (e) => {
    run.current = true;
    setFiles((prev) => [...prev, ...e.target.files]);
  };
  return (
    <input
      className={styles.input_file}
      type="file"
      onChange={handleInput}
      multiple
      {...props}
    ></input>
  );
};

FileUpload.Drag = function DragUpload({ children, ...props }) {
  const { setFiles, run } = useContext(Kits);
  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    run.current = true;
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
  const { files, setFiles, setPrevFiles, run } = useContext(Kits);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpenPreview = (e, index) => {
    if (e.detail > 1)
      window.open(`${previews[index]}`, `${files[index].name}`, `popup`);
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

  useLayoutEffect(() => {
    setLoading(true);
    Promise.all(files.map((item) => handleFile(item)))
      .then((files) => run.current && setPreviews(files))
      .then(() => setLoading(false));
    setPrevFiles(files);
  }, [files]);
  return (
    <div {...props}>
      {loading && <div>Loading....</div>}
      {previews.map((preview, index) => {
        return (
          <div
            key={index}
            className={styles.preview}
            onClick={(e) => handleOpenPreview(e, index)}
          >
            <div>
              <img
                alt="Preview"
                src={preview.includes("image") ? preview : ""}
              ></img>
              <AiOutlineClose
                onClick={(e) => handleDelete(e, index)}
                onMouseEnter={(e) =>
                  (e.target.parentElement.style.opacity = 0.8)
                }
                onMouseLeave={(e) => (e.target.parentElement.style.opacity = 1)}
              ></AiOutlineClose>
            </div>
            <span>{files[index].name}</span>
          </div>
        );
      })}
    </div>
  );
};
