import { useDispatch, useSelector } from "react-redux";
import { IoIosClose } from "react-icons/io";
import { Animation, Form, Icon, Increment } from "../../components";
import { addCart, clearCart, removeCart } from "../../redux/reducer/cartSlice";
import { useState, useEffect } from "react";
import Head from "next/head";
import { retryAxios, Validate } from "../../utils";
import axios from "axios";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { useRouter } from "next/router";
import Link from "next/link";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function Cart() {
  const [display, setDisplay] = useState(false);
  const [address, setAddress] = useState("");
  const cartState = useSelector((state) => state.cart);
  const [cart, setCart] = useState({
    products: [
      {
        productId: "",
        variationId: "",
        title: "",
        image: "",
        options: [],
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

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    retryAxios(axios);
    try {
      new Validate(address).isEmpty().isNotSpecial();
      await axios.post(`${LocalApi}/order`, { ...cart, address });
      dispatch(clearCart());
      setDisplay(false);
      router.back();
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  return (
    <div className="cart__container">
      <Head>
        <title>Shopping Cart</title>
      </Head>
      <div className="cart__lst">
        {cart.products.length ? (
          cart.products.map((item) => (
            <Animation.Zoom key={item.title + item.variationId}>
              <Link href={`/overview/${item.productId}`}>
                <a className="cart__product ux-card">
                  <div className="cart__product__info">
                    <img alt="product" src={item.image}></img>
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
                        {item.price} $
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
                      <span>Total: </span> {item.total} $
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
                    <IoIosClose />
                  </Icon>
                </a>
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
            <dd>{cart.total}$</dd>
            <dt>Shipping fee</dt>
            <dd>{cart.quantity * 0.5}$</dd>
          </dl>
          <dl className="total">
            <dt>Total</dt>
            <dd>{cart.total + cart.quantity * 0.5}$</dd>
          </dl>
          <button onClick={() => setDisplay(true)}>Checkout</button>
        </div>
      </div>
      {display && (
        <>
          <div
            className="backdrop"
            onClick={() => {
              setAddress(""), setDisplay(false);
            }}
          ></div>
          <Form onSubmit={handleSubmit} className="form_center">
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
  );
}
