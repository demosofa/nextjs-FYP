import { useDispatch, useSelector } from "react-redux";
import { IoIosClose } from "react-icons/io";
import { Animation, Icon, Increment } from "../../components";
import { addCart, removeCart } from "../../redux/reducer/cartSlice";
import { useState, useEffect } from "react";
import Head from "next/head";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

// export async function getServerSideProps() {
//   const response = await fetch(`${LocalApi}/cart/2`, {
//     method: "GET",
//   });
//   const data = await response.json();
//   return {
//     props: data,
//   };
// }

export default function Cart() {
  const cartState = useSelector((state) => state.cart);
  const [cart, setCart] = useState({
    products: [
      {
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

  const dispatch = useDispatch();
  return (
    <div className="cart__container">
      <Head>
        <title>Shopping Cart</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="cart__lst">
        {cart.products.map((item) => (
          <Animation.Zoom key={item.title}>
            <div className="cart__product">
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
                onClick={() => dispatch(removeCart(item))}
                style={{ padding: 0 }}
              >
                <IoIosClose />
              </Icon>
            </div>
          </Animation.Zoom>
        ))}
      </div>
      <div className="cart__total"></div>
    </div>
  );
}
