import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../../redux/reducer/cartSlice";
import {
  ImageMagnifier,
  Checkbox,
  ReadMoreLess,
  Increment,
  Slider,
  Timer,
  Breadcrumb,
} from "../../components";
import { Comment, Rating } from "../../containers";
import { Media } from "../_app";
import { addNotification } from "../../redux/reducer/notificationSlice";
import Head from "next/head";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export async function getServerSideProps({ params }) {
  const data = await fetch(`${LocalApi}/product/${params.productId}`);
  const product = await data.json();
  return {
    props: {
      product,
    },
  };
}

export default function Overview({ product }) {
  const [targetImage, setTargetImage] = useState(product.images[0].url);
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState([]);
  const targetVariation = useMemo(() => {
    const index = product.variations.findIndex((item) =>
      item.types.every((value) =>
        options.some((opt) => opt.includes(value.name))
      )
    );
    return product.variations[index];
  }, [options, product.variations]);

  const { device, Devices } = useContext(Media);

  const dispatch = useDispatch();
  const handleAddToCart = () => {
    let { _id, title, images, price } = product;
    let variationId = null;
    let variationImage = null;
    if (targetVariation) {
      variationId = targetVariation._id;
      price = targetVariation.price;
      variationImage = targetVariation.image?.url;
    }
    dispatch(
      addCart({
        productId: _id,
        variationId,
        title,
        image: variationImage || images[0].url,
        options,
        quantity,
        price,
        total: quantity * price,
      })
    );
    dispatch(
      addNotification({
        message: `Success add ${title} to Cart`,
        type: "success",
      })
    );
  };

  useEffect(() => {
    if (targetVariation && targetVariation.image)
      setTargetImage(targetVariation.image.url);
  }, [options, product.images, targetVariation]);

  return (
    <div className="page-overview">
      <Head>
        <title>{product.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Breadcrumb categories={product.categories} />
      <div className="container-info">
        <div className="preview-product">
          <ImageMagnifier
            src={targetImage}
            style={{ width: "100%", height: "350px" }}
            className="product-img"
          ></ImageMagnifier>
          <Slider
            className="slider"
            config={{
              vertical: device === Devices.phone ? true : false,
              slides: { perView: 1 },
            }}
          >
            {product.images.map((image, index) => (
              <img
                alt="variation"
                key={index}
                src={image.url}
                onMouseEnter={() => setTargetImage(image.url)}
              ></img>
            ))}
          </Slider>
        </div>
        <div className="product-info">
          <label>{product.title}</label>
          <div>
            <label>{product.rateCount}</label>
          </div>
          {product.time && <Timer value={product.time} />}

          <div className="flex gap-3">
            <label>Price: </label>
            <div>
              {targetVariation
                ? targetVariation.price
                : product.time
                ? product.sale
                : product.price}{" "}
              $
            </div>
          </div>

          {product.variants.map((variant, index) => {
            return (
              <Checkbox
                key={variant._id}
                type="radio"
                name={variant.name}
                style={{ display: "flex", justifyContent: "space-between" }}
                setChecked={(value) =>
                  setOptions((prev) => {
                    const clone = prev.concat();
                    clone[index] = value.join("");
                    return clone;
                  })
                }
              >
                {variant.name}
                {variant.options.map((item, index) => {
                  return (
                    <div key={item._id} style={{ width: "fit-content" }}>
                      <Checkbox.Item
                        value={`${variant.name}: ${item.name}`}
                        defaultChecked={index === 0}
                      >
                        {item.name}
                      </Checkbox.Item>
                    </div>
                  );
                })}
              </Checkbox>
            );
          })}

          {(!targetVariation && product.quantity > 0) ||
          targetVariation?.quantity > 0 ? (
            <div
              className="flex items-center justify-center gap-3"
              style={{
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <Increment
                value={quantity}
                setValue={setQuantity}
                max={
                  targetVariation ? targetVariation.quantity : product.quantity
                }
                style={{ flex: 1 }}
              />
              <button
                style={{ flex: 1 }}
                className="btn-add-to-cart"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button style={{ flex: 1 }} className="btn-add-to-cart">
                Order
              </button>
            </div>
          ) : (
            <span>Out of Stock right now</span>
          )}
        </div>
      </div>

      <div>
        <dl>
          <dt>Description: </dt>
          <dd>
            <ReadMoreLess style={{ height: "150px" }}>
              <p className="text-ellipsis whitespace-pre-wrap leading-[1.7]">
                {product.description}
              </p>
            </ReadMoreLess>
          </dd>
        </dl>
      </div>

      <Rating url={`${LocalApi}/rating/${product._id}`} />

      <Comment url={`${LocalApi}/product/${product._id}/comment`} />
    </div>
  );
}
