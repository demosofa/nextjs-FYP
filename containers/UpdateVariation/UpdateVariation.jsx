import axios from "axios";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Loading, Checkbox, Animation } from "../../components";
import { useAxiosLoad } from "../../hooks";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { retryAxios } from "../../utils";
import { AiOutlineCheck } from "react-icons/ai";
import styles from "./updatevariation.module.scss";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function UpdateVariation({ productId, setToggle }) {
  const [storedVariations, setStoredVariations] = useState([]);
  const [variationImage, setVariationImage] = useState(null);
  const [storedImages, setStoredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();

  const { loading } = useAxiosLoad({
    async callback(axiosInstance) {
      const response = (
        await axiosInstance({
          url: `${LocalApi}/product/${productId}/variation`,
        })
      ).data;
      setStoredVariations(response);
    },
  });

  const { loading: loadingImage } = useAxiosLoad({
    async callback(axiosInstance) {
      const response = (
        await axiosInstance({
          url: `${LocalApi}/product/${productId}/image`,
        })
      ).data;
      setStoredImages(response);
    },
  });

  const handleChangeImage = () => {
    setStoredVariations((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone[variationImage].image = selectedImage;
      return clone;
    });
    setVariationImage(null);
  };

  const handleEditVariation = (payload, index) => {
    setStoredVariations((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone[index] = { ...clone[index], ...payload };
      return clone;
    });
  };

  const handleSaveVariation = async () => {
    try {
      retryAxios(axios);
      await axios.patch(`${LocalApi}/product/${productId}/variation`, {
        variations: storedVariations,
      });
      setToggle(null);
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  if (loading) return <Loading.Text />;
  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Image</th>
              <th>Sku</th>
              <th>Type</th>
              <th>price</th>
              <th>quantity</th>
            </tr>
          </thead>
          <tbody>
            {storedVariations?.length ? (
              storedVariations.map((variation, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td onClick={(e) => setVariationImage(index)}>
                      {variation.image && (
                        <img
                          alt="product"
                          src={variation.image.url}
                          style={{ width: "100px", height: "80px" }}
                        ></img>
                      )}
                    </td>
                    <td>
                      <input
                        value={variation.sku}
                        onChange={(e) =>
                          handleEditVariation({ sku: e.target.value }, index)
                        }
                      ></input>
                    </td>
                    <td>
                      {variation.types.map((type) => type.name).join("/")}
                    </td>
                    <td>
                      <input
                        value={variation.price}
                        onChange={(e) =>
                          handleEditVariation({ price: e.target.value }, index)
                        }
                      ></input>
                    </td>
                    <td>
                      <input
                        value={variation.quantity}
                        onChange={(e) =>
                          handleEditVariation(
                            { quantity: e.target.value },
                            index
                          )
                        }
                      ></input>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  There is any variations for this product
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-6">
        <button
          className="cursor-pointer rounded-lg border-0 bg-gradient-to-r from-orange-300 to-red-500 px-4 py-3 text-sm font-semibold text-white"
          type="button"
          onClick={handleSaveVariation}
        >
          Save Variation
        </button>
        <button
          className="cursor-pointer rounded-lg border-0 bg-gradient-to-r from-orange-300 to-red-500 px-4 py-3 text-sm font-semibold text-white"
          type="button"
          onClick={() => setToggle(null)}
        >
          Cancel
        </button>
      </div>

      {variationImage !== null && (
        <>
          <div className="backdrop" onClick={() => setVariationImage(null)} />
          <div className="form_center w-[500px] max-w-full">
            <Checkbox
              className={styles.radio_img}
              name="image"
              type="radio"
              setChecked={(value) => setSelectedImage(value[0])}
            >
              <Animation.Fade>
                {storedImages?.map((image) => {
                  return (
                    <Fragment key={image._id}>
                      <label
                        className={
                          [image].includes(selectedImage)
                            ? styles.checked
                            : styles.unchecked
                        }
                        style={{
                          display: "block",
                          width: "100px",
                          height: "80px",
                        }}
                      >
                        <Checkbox.Item
                          value={image}
                          style={{ display: "none" }}
                        ></Checkbox.Item>
                        <img className="h-full w-full" src={image.url}></img>
                        {[image].includes(selectedImage) && (
                          <div className="absolute top-0 left-0 h-full w-full bg-white/70">
                            <AiOutlineCheck
                              width="50%"
                              height="50%"
                              className={styles.icon}
                            />
                          </div>
                        )}
                      </label>
                    </Fragment>
                  );
                })}
              </Animation.Fade>
            </Checkbox>
            <button onClick={handleChangeImage}>Save</button>
            <button onClick={() => setVariationImage(null)}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}
