import { useDispatch, useSelector } from "react-redux";
import { IoIosClose } from "react-icons/io";
import { Animation, Icon, Increment } from "../../components";
import { addProduct, removeProduct } from "../../redux/reducer/CartSlice";

export default function Cart() {
  const cartState = useSelector((state) => {
    // console.log(state);
    return state.cart;
  });
  const dispatch = useDispatch();
  return (
    <div className="cart__container">
      <div className="cart__lst">
        {cartState.products.map((item) => (
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
                    {item.option}
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
                  setValue={(value) =>
                    dispatch(
                      addProduct({
                        ...item,
                        quantity: value,
                        total: Math.round(value * item.price),
                      })
                    )
                  }
                  style={{ width: "100px" }}
                />
                <div className="info">
                  <span>Total: </span> {item.total} $
                </div>
              </div>
              <Icon
                className="remove__product"
                onClick={() => dispatch(removeProduct(item))}
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
