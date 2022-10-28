import axios from "axios";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ImageMagnifier,
  Checkbox,
  ReadMoreLess,
  Increment,
  Slider,
  Breadcrumb,
  StarRating,
} from "../../components";
import {
  Comment,
  PriceInfo,
  ProductSlider,
  Rating,
  ReceivingAddress,
} from "../../containers";
import { expireStorage, retryAxios, Validate } from "../../utils";
import { useMediaContext } from "../../contexts/MediaContext";
import { addCart } from "../../redux/reducer/cartSlice";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { addViewed } from "../../redux/reducer/recentlyViewedSlice";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const [display, setDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [similiarProducts, setSimiliarProducts] = useState([]);
  const [options, setOptions] = useState([]);

  const targetVariationIdx = useMemo(() => {
    return product.variations.findIndex((item) =>
      item.types.every((value) =>
        options.some((opt) => opt.split(":")[1]?.trim() === value.name)
      )
    );
  }, [options, product.variations]);
  const targetVariation = product.variations[targetVariationIdx];

  const dispatch = useDispatch();
  const router = useRouter();
  const { device, Devices } = useMediaContext();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${LocalApi}/product/all`, {
        params: {
          category: product.categories.at(-1).name,
          filter: product.title,
        },
      })
      .then((res) => {
        setSimiliarProducts(res.data.products);
        setLoading(false);
      });
  }, []);

  const generateCart = () => {
    let { _id, title, images, price, length, width, height, time, sale } =
      product;
    let variationId = null;
    let variationImage = null;
    let extraCostPerItem = (length * width * height) / 6000;
    if (targetVariation) {
      variationId = targetVariation._id;
      variationImage = targetVariation.image?.url;
      price =
        targetVariation.time &&
        new Date(targetVariation.time).getTime() > Date.now()
          ? targetVariation.sale
          : targetVariation.price;
      extraCostPerItem =
        (targetVariation.length *
          targetVariation.width *
          targetVariation.height) /
        6000;
    }
    if (time && new Date(time).getTime() > Date.now()) {
      price = sale;
    }
    return {
      productId: _id,
      variationId,
      title,
      image: variationImage || images[0].url,
      options,
      extraCostPerItem: Math.ceil(extraCostPerItem) * 5000,
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

  const handleOrder = async (e, address) => {
    e.preventDefault();
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    try {
      let products = [generateCart()];
      new Validate(address).isEmpty().isAddress();
      const shippingFee = products.reduce((prev, curr) => {
        return prev + curr.quantity * curr.extraCostPerItem;
      }, 0);
      await axios.post(
        `${LocalApi}/order`,
        {
          products,
          shippingFee,
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
      dispatch(
        addNotification({ message: "Success order product", type: "success" })
      );
      router.reload();
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  useEffect(() => {
    if (targetVariation && targetVariation.image)
      setTargetImage(targetVariation.image.url);
  }, [options, product.images, targetVariation]);

  useEffect(() => {
    let { _id, title, images, price, avgRating, sold, time, sale, variations } =
      product;
    const thumbnail = images[0].url;
    dispatch(
      addViewed({
        _id,
        title,
        thumbnail,
        price,
        time,
        sale,
        avgRating,
        sold,
        variations,
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
              <Slider.Content className="h-20 sm:h-80">
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
            <div className="flex w-full items-center gap-2">
              <StarRating id="star" value={product.avgRating} />
              <label>{`(${product.rateCount} reviews)`}</label>
            </div>

            <PriceInfo
              saleEvent={{
                time: targetVariation ? targetVariation.time : product.time,
                sale: targetVariation ? targetVariation.sale : product.sale,
              }}
              price={targetVariation ? targetVariation.price : product.price}
            />

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
                  className="btn-add-to-cart shadow-lg"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  className="btn-add-to-cart shadow-lg"
                  onClick={() => setDisplay(true)}
                >
                  Order
                </button>
              </div>
            ) : (
              <span className="text-2xl font-medium text-gray-700">
                Out of Stock right now
              </span>
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

          <dt className="w-fit text-lg font-medium">Tags: </dt>
          <dd className="ml-2 mt-1">
            {product.tags.map((tag) => (
              <Link key={tag} href={{ pathname: "/", query: { search: tag } }}>
                <a className="ml-2">#{tag}</a>
              </Link>
            ))}
          </dd>
        </dl>

        <Rating url={`${LocalApi}/rating/${product._id}`} />

        <Comment url={`${LocalApi}/product/${product._id}/comment`} />

        {!loading && similiarProducts?.length ? (
          <div className="w-full">
            <p className="my-5">Similiar product you may want to check</p>
            <ProductSlider products={similiarProducts} />
          </div>
        ) : null}

        {display && (
          <ReceivingAddress setDisplay={setDisplay} handleOrder={handleOrder} />
        )}
      </div>
    </>
  );
}
