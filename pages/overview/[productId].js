import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../../redux/reducer/cartSlice";
import {
  ImageMagnifier,
  Checkbox,
  Container,
  ReadMoreLess,
  Rating,
  Increment,
  Slider,
  Timer,
  Breadcrumb,
} from "../../components";
import { Comment } from "../../containers";
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
  const [image, setImage] = useState();
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState([]);
  const targetVariation = useMemo(() => {
    const index = product.variations.findIndex((item) =>
      item.types.every((value) => options.includes(value.name))
    );
    return product.variations[index];
  }, [options, product.variations]);

  const { device, Devices } = useContext(Media);

  const dispatch = useDispatch();
  const handleAddToCart = () => {
    let { _id, title, images, price } = product;
    if (targetVariation) price = targetVariation.price;
    dispatch(
      addCart({
        productId: _id,
        title,
        image: image?.url || images[0].url,
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
      setImage(targetVariation.image.url);
    else setImage(product.images[0].url);
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
            src={image}
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
                onMouseEnter={() => setImage(image.url)}
              ></img>
            ))}
          </Slider>
        </div>
        <div className="product-info">
          <label>{product.title}</label>

          {product.time && <Timer value={product.time} />}

          <Container.Flex style={{ gap: "10px" }}>
            <label>Price: </label>
            <div>
              {targetVariation ? targetVariation.price : product.price} $
            </div>
          </Container.Flex>

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
                        value={item.name}
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

          <Container.Flex
            style={{
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <Increment
              value={quantity}
              setValue={setQuantity}
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
          </Container.Flex>
        </div>
      </div>

      <div>
        <Container.Flex>
          <label>Description: </label>
          <ReadMoreLess style={{ height: "150px" }}>
            {product.description}
          </ReadMoreLess>
        </Container.Flex>
      </div>

      <div className="rating">
        <Rating rated={4} />
        <div className="count">{product.rating}</div>
      </div>

      <Comment url={`${LocalApi}/product/${product._id}/comment`} />
    </div>
  );
}
