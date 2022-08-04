import axios from "axios";
import { useMemo, useState } from "react";
import { Container, FileUpload, Loading } from "../../components";
import { useAuthLoad } from "../../hooks";
import { AiOutlinePlus } from "react-icons/ai";
import { retryAxios, uploadApi } from "../../utils";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function UpdateImage({ productId }) {
  const [filterImages, setFilterImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const dispatch = useDispatch();
  const {
    loading,
    data: storedImages,
    setData: setStoredImages,
  } = useAuthLoad({
    config: {
      url: `${LocalApi}/product/image/${productId}`,
    },
    roles: ["guest"],
  });

  const currentSize = useMemo(() => {
    let currentBytes = storedImages?.reduce(
      (prev, curr) => prev + curr.size,
      0
    );
    return currentBytes / (1024 * 1024);
  }, [storedImages]);

  const handleSaveImage = async (e) => {
    let uploaded;
    try {
      retryAxios(axios);
      uploaded = await Promise.all(
        newImages.map((image) =>
          uploadApi(axios, {
            path: "store",
            file: image,
          })
        )
      );
      await axios.put(`${LocalApi}/product/image/${productId}`, {
        newImages: uploaded,
        filterImages,
      });
      if (filterImages.length) {
        const arrPublic_id = filterImages.map((item) => item.public_id);
        await axios.post(`${LocalApi}/destroy`, {
          path: "store",
          files: arrPublic_id,
        });
      }
    } catch (error) {
      const arrPublic_id = uploaded.map((item) => item.public_id);
      await axios.post(`${LocalApi}/destroy`, {
        path: "store",
        files: arrPublic_id,
      });
      dispatch(addNotification({ message: error.message }));
    }
  };
  const handleDeleteImage = (e, index) => {
    e.preventDefault();
    setFilterImages(storedImages.filter((_, i) => i === index));
    setStoredImages((prev) => prev.filter((_, i) => i !== index));
  };
  if (loading)
    return (
      <Loading
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%)`,
        }}
      ></Loading>
    );
  return (
    <Container>
      <FileUpload
        setPrevFiles={(images) => setNewImages(images)}
        maxByMB={10 - currentSize}
      >
        {storedImages.map((image, index) => {
          return (
            <img
              key={image._id}
              style={{
                width: "25%",
                margin: "2px",
              }}
              alt="product"
              src={image.url}
              onClick={(e) => handleDeleteImage(e, index)}
            ></img>
          );
        })}
        <FileUpload.Show></FileUpload.Show>
        <FileUpload.Input
          id="file_input"
          multiple
          style={{
            display: "none",
          }}
        >
          <label htmlFor="file_input" className="add_file__btn">
            <AiOutlinePlus style={{ width: "30px", height: "30px" }} />
          </label>
        </FileUpload.Input>
      </FileUpload>
      <button onClick={handleSaveImage}>Save</button>
    </Container>
  );
}
