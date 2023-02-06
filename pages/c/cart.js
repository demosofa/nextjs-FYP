import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Animation, Icon, Increment } from "../../frontend/components";
import { ReceivingAddress } from "../../frontend/containers";
import {
  addCart,
  clearCart,
  removeCart,
} from "../../frontend/redux/reducer/cartSlice";
import { addNotification } from "../../frontend/redux/reducer/notificationSlice";
import { expireStorage, retryAxios, Validate } from "../../frontend/utils";
import { currencyFormat } from "../../shared";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function Cart() {
  const [display, setDisplay] = useState(false);
  const cartState = useSelector((state) => state.cart);
  const [cart, setCart] = useState({
    products: [
      {
        productId: "",
        variationId: "",
        title: "",
        image: "",
        options: [],
        extraCostPerItem: 0,
        quantity: 0,
        price: 0,
        total: 0,
      },
    ],
    quantity: 0,
    total: 0,
  });

  useEffect(() => {
    setCart(cartState);
  }, [cartState]);

  const shippingFee = cart.products.reduce((prev, curr) => {
    return prev + curr.quantity * curr.extraCostPerItem;
  }, 0);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e, address) => {
    e.preventDefault();
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    try {
      if (!cart.products.length)
        throw new Error("There is any products in cart");
      new Validate(address).isEmpty().isAddress();
      await axios.post(
        `${LocalApi}/order`,
        { ...cart, shippingFee, address },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      dispatch(clearCart());
      dispatch(
        addNotification({ message: "Success order your cart", type: "success" })
      );
      setDisplay(false);
      router.back();
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  return (
    <div className="cart__container">
      <Head>
        <title>Shopping Cart</title>
        <meta name="description" content="Shopping Cart" />
      </Head>
      <div className="cart__lst">
        {cart.products.length ? (
          cart.products.map((item) => (
            <Animation.Zoom key={item.title + item.variationId}>
              <Link
                className="cart__product ux-card"
                href={`/c/${item.productId}`}
              >
                <div className="cart__product__info">
                  <img alt="product" src={item.image} />
                  <div className="product__info">
                    <div className="info product__title">
                      <span>Title: </span>
                      {item.title}
                    </div>
                    <div className="info product__option">
                      <span>Option: </span>
                      {item.options.join(", ")}
                    </div>
                    <div className="info product__price">
                      <span>Price: </span>
                      {currencyFormat(item.price)}
                    </div>
                  </div>
                </div>

                <div className="change__quantity">
                  <Increment
                    value={item.quantity}
                    setValue={(value) => {
                      if (item.title) {
                        dispatch(
                          addCart({
                            ...item,
                            quantity: value,
                            total: Math.round(value * item.price),
                          })
                        );
                      }
                    }}
                    style={{ width: "100px" }}
                  />
                  <div className="info">
                    <span>Total: </span> {currencyFormat(item.total)}
                  </div>
                </div>
                <Icon
                  className="remove__product"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(removeCart(item));
                  }}
                  style={{ padding: 0 }}
                >
                  <RiCloseFill />
                </Icon>
              </Link>
            </Animation.Zoom>
          ))
        ) : (
          <label>There is any cart</label>
        )}
      </div>
      <div className="summary ux-card">
        <div>
          <dl className="sub-total">
            <dt>Sub Total</dt>
            <dd>{currencyFormat(cart.total)}</dd>
            <dt>Shipping fee</dt>
            <dd>{currencyFormat(shippingFee)}</dd>
          </dl>
          <dl className="total">
            <dt>Total</dt>
            <dd>{currencyFormat(cart.total + shippingFee)}</dd>
          </dl>
          <button onClick={() => setDisplay(true)}>Checkout</button>
        </div>
      </div>
      {display && (
        <ReceivingAddress setDisplay={setDisplay} handleOrder={handleSubmit} />
      )}
    </div>
  );
}
