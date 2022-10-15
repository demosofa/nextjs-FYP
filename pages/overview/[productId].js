import axios from "axios";
import Head from "next/head";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ImageMagnifier,
  Checkbox,
  ReadMoreLess,
  Increment,
  Slider,
  Timer,
  Breadcrumb,
  Form,
} from "../../components";
import { Comment, ProductSlider, Rating } from "../../containers";
import { expireStorage, retryAxios, Validate } from "../../utils";
import { useMediaContext } from "../../contexts/MediaContext";
import { addCart } from "../../redux/reducer/cartSlice";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { addViewed } from "../../redux/reducer/recentlyViewedSlice";
import Link from "next/link";
import { currencyFormat } from "../../shared";
import { useObserver } from "../../hooks";
import Image from "next/image";

const LocalApi = process.env.NEXT_PUBLIC_API;

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
  const [address, setAddress] = useState("");
  const [display, setDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [similiarProducts, setSimiliarProducts] = useState([]);
  const [options, setOptions] = useState([]);
  const targetVariation = useMemo(() => {
    const index = product.variations.findIndex((item) =>
      item.types.every((value) =>
        options.some((opt) => opt.includes(value.name))
      )
    );
    return product.variations[index];
  }, [options, product.variations]);

  const { device, Devices } = useMediaContext();
  const observerRef = useObserver({
    isMany: false,
    callback: async (_, observer) => {
      if (!loading && !similiarProducts.length) {
        setLoading(true);
        const response = await axios.get(`${LocalApi}/product/all`, {
          params: { category: product.categories.at(-1).name },
        });
        setSimiliarProducts(response.data.products);
        setLoading(false);
      } else observer.disconnect();
    },
  });

  const dispatch = useDispatch();
  const generateCart = () => {
    let { _id, title, images, price } = product;
    let variationId = null;
    let variationImage = null;
    if (targetVariation) {
      variationId = targetVariation._id;
      price = targetVariation.price;
      variationImage = targetVariation.image?.url;
    }
    return {
      productId: _id,
      variationId,
      title,
      image: variationImage || images[0].url,
      options,
      quantity,
      price,
      total: quantity * price,
    };
  };
  const handleAddToCart = () => {
    dispatch(addCart(generateCart()));
    dispatch(
      addNotification({
        message: `Success add ${product.title} to Cart`,
        type: "success",
      })
    );
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    try {
      let products = [generateCart()];
      new Validate(address).isEmpty().isNotSpecial();
      await axios.post(
        `${LocalApi}/order`,
        {
          products,
          total: products[0].total,
          quantity: products[0].quantity,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDisplay(false);
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  useEffect(() => {
    if (targetVariation && targetVariation.image)
      setTargetImage(targetVariation.image.url);
  }, [options, product.images, targetVariation]);

  useEffect(() => {
    const { title, images, price, avgRating } = product;
    const thumbnail = images[0].url;
    dispatch(
      addViewed({
        title,
        thumbnail,
        price,
        rate: avgRating,
        url: window.location.href,
      })
    );
  }, [product]);

  return (
    <>
      <Breadcrumb className="pl-4" categories={product.categories} />
      <div className="page-overview">
        <Head>
          <title>{product.title}</title>
          <meta name="description" content={product.description} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="container-info">
          <div className="preview-product">
            {device === Devices.phone ? null : (
              <ImageMagnifier src={targetImage} className="product-img" />
            )}
            <Slider
              className="slider"
              config={{
                slides: {
                  perView: device === Devices.phone ? 1 : 4,
                  spacing: 12,
                },
              }}
            >
              <Slider.Content className="h-20 sm:h-60">
                {product.images.map((image, index) => (
                  <img
                    className="rounded-lg"
                    alt="variation"
                    key={index}
                    src={image.url}
                    onMouseEnter={() => setTargetImage(image.url)}
                  />
                ))}
              </Slider.Content>
            </Slider>
          </div>
          <div className="product-info">
            <label className="text-2xl">{product.title}</label>
            <div>
              <label>{product.rateCount}</label>
            </div>

            {product.time && new Date(product.time).getTime() > Date.now() ? (
              <Timer value={new Date(product.time).getTime()} />
            ) : null}

            <div className="flex items-center gap-3">
              <label className="text-lg font-medium">Price: </label>
              <span>
                {currencyFormat(
                  targetVariation
                    ? targetVariation.price
                    : product.time
                    ? product.sale
                    : product.price
                )}
              </span>
            </div>

            {product.variants.map((variant, index) => {
              return (
                <Checkbox
                  key={variant._id}
                  type="radio"
                  name={variant.name}
                  className="flex h-fit items-center justify-between"
                  setChecked={(value) =>
                    setOptions((prev) => {
                      const clone = prev.concat();
                      clone[index] = value.join("");
                      return clone;
                    })
                  }
                >
                  <label className="text-lg font-medium capitalize">
                    {variant.name}
                  </label>
                  {variant.options.map((item, index) => {
                    return (
                      <div className="mx-2 w-full" key={item._id}>
                        <Checkbox.Item
                          className="peer hidden"
                          id={item.name}
                          value={`${variant.name}: ${item.name}`}
                          defaultChecked={index === 0}
                        />
                        <label
                          className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-gray-200 bg-white font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:bg-orange-600 peer-checked:text-white"
                          htmlFor={item.name}
                        >
                          {item.name}
                        </label>
                      </div>
                    );
                  })}
                </Checkbox>
              );
            })}

            {(!targetVariation && product.quantity > 0) ||
            targetVariation?.quantity > 0 ? (
              <div className="flex items-center justify-center gap-3">
                <Increment
                  value={quantity}
                  setValue={setQuantity}
                  max={
                    targetVariation
                      ? targetVariation.quantity
                      : product.quantity
                  }
                  style={{ flex: 1 }}
                />
                <button
                  className="btn-add-to-cart flex-1"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  className="btn-add-to-cart flex-1"
                  onClick={() => setDisplay(true)}
                >
                  Order
                </button>
              </div>
            ) : (
              <span>Out of Stock right now</span>
            )}
          </div>
        </div>

        <dl>
          <dt className="text-lg font-medium">Description: </dt>
          <dd>
            <ReadMoreLess style={{ height: "150px" }}>
              <p className="text-ellipsis whitespace-pre-wrap leading-[1.7]">
                {product.description}
              </p>
            </ReadMoreLess>
          </dd>
          <dl className="flex items-center">
            <dt className="text-lg font-medium">Tags: </dt>
            <dd>
              {product.tags.map((tag, index) => {
                return (
                  <Fragment key={tag}>
                    <Link href={{ pathname: "/", query: { search: tag } }}>
                      <a>#{tag}</a>
                    </Link>
                    {index < product.tags - 1 ? ", " : null}
                  </Fragment>
                );
              })}
            </dd>
          </dl>
        </dl>

        <Rating url={`${LocalApi}/rating/${product._id}`} />

        <Comment url={`${LocalApi}/product/${product._id}/comment`} />
        <div ref={observerRef} className="w-full">
          {!loading && similiarProducts?.length ? (
            <ProductSlider products={similiarProducts} />
          ) : null}
        </div>

        {display && (
          <>
            <div
              className="backdrop"
              onClick={() => {
                setAddress(""), setDisplay(false);
              }}
            ></div>
            <Form onSubmit={handleOrder} className="form_center">
              <Form.Title>Please set form for your checkout</Form.Title>
              <Form.Item>
                <Form.Title>Your Address</Form.Title>
                <Form.Input
                  onChange={(e) => setAddress(e.target.value)}
                ></Form.Input>
              </Form.Item>
              <Form.Link
                target="_blank"
                href={`https://maps.google.com/maps?q=${address}`}
              >
                Check address in google map
              </Form.Link>
              <Form.Item>
                <Form.Submit>Submit</Form.Submit>
                <Form.Button
                  onClick={() => {
                    setAddress(""), setDisplay(false);
                  }}
                >
                  Cancel
                </Form.Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </>
  );
}
