import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Loading, Checkbox, Animation } from "../../components";
import { useAuthLoad } from "../../hooks";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { retryAxios } from "../../utils";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function UpdateVariation({ productId, setToggle }) {
  const [variationImage, setVariationImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();

  const {
    loading,
    data: storedVariations,
    setData: setStoredVariations,
  } = useAuthLoad({
    config: { url: `${LocalApi}/product/${productId}/variation` },
    roles: ["guest"],
  });

  const { loading: loadingImages, data: storedImages } = useAuthLoad({
    config: { url: `${LocalApi}/product/${productId}/image` },
    roles: ["guest"],
  });

  const handleChangeImage = () => {
    setStoredVariations((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[variationImage].image = selectedImage;
      return copy;
    });
    setVariationImage(null);
  };

  const handleEditVariation = (payload, index) => {
    setStoredVariations((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[index] = { ...copy[index], ...payload };
      return copy;
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
      dispatch(addNotification({ message: error.message }));
    }
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
    <div style={{ overflowX: "auto" }}>
      <table>
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
          {storedVariations?.map((variation, index) => {
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
                <td>{variation.types.map((type) => type.name).join("/")}</td>
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
                      handleEditVariation({ quantity: e.target.value }, index)
                    }
                  ></input>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={handleSaveVariation}>Save Variation</button>
      <button onClick={() => setToggle(null)}>Cancel</button>
      {variationImage !== null && (
        <div
          style={{
            width: "500px",
            height: "350px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 13,
            borderRadius: "15px",
            backgroundColor: "white",
            gap: "15px",
          }}
        >
          <Checkbox
            name="image"
            type="radio"
            setChecked={(value) => setSelectedImage(value[0])}
            style={{
              width: "80%",
              height: "80%",
              overflowX: "auto",
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <Animation.Fade>
              {storedImages?.map((image) => {
                return (
                  <div key={image._id} style={{ width: "fit-content" }}>
                    <Checkbox.Item value={image}>
                      <img
                        style={{ width: "80px", height: "60px" }}
                        src={image.url}
                      ></img>
                    </Checkbox.Item>
                  </div>
                );
              })}
            </Animation.Fade>
          </Checkbox>
          <button onClick={handleChangeImage}>Save</button>
          <button onClick={() => setVariationImage(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
