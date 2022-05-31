import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/reducer/CartSlice";
import {
  ImageMagnifier,
  CommentSection,
  Checkbox,
  Container,
  ReadMoreLess,
  Rating,
  Increment,
  Loading,
  Slider,
} from "../components";
import { Media } from "../Layout";
import "../styles/_overview.scss";

const arrayLink = [
  "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
  "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
  "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
];

function getServerSideProp() {}

export default function Overview() {
  const navigate = useNavigate();
  const [image, setImage] = useState();
  const [quantity, setQuantity] = useState(1);
  const [option, setOption] = useState();

  const { device, Devices } = useContext(Media);

  const dispatch = useDispatch();
  const handleOrder = () => {
    dispatch(
      addProduct({
        ...product,
        quantity,
        total: quantity * product.price,
      })
    );
    navigate("/cart");
  };

  if (loading)
    return (
      <>
        <Loading
          style={{
            zIndex: 1000,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: `translate(-50%,-50%)`,
          }}
        />
        <Container.BackDrop />
      </>
    );

  return (
    <div className="page-overview">
      <div className="container-info">
        <div className="preview-product">
          <ImageMagnifier
            src={image || product.image}
            style={{ maxWidth: "300px", height: "350px" }}
            className="product-img"
          ></ImageMagnifier>
          <Slider
            config={{
              vertical: device !== Devices.phone ? true : false,
              slides: { perView: 3 },
            }}
          >
            <Slider.Content className="slider">
              {arrayLink.map((src) => (
                <img src={src}></img>
              ))}
            </Slider.Content>
          </Slider>
        </div>
        <div className="product-info">
          <label>{product.title}</label>
          <Container.Flex style={{ gap: "10px" }}>
            <label>Price: </label>
            <div>{product.price}</div>
          </Container.Flex>
          <Container.Flex style={{ gap: "10px" }}>
            <label>Category: </label>
            <div className="categrory">{product.category}</div>
          </Container.Flex>
          <Checkbox
            type="radio"
            name="size"
            style={{ display: "flex", justifyContent: "space-between" }}
            setChecked={setOption}
          >
            Size:
            {["M", "L", "XL", "XXL"].map((item) => {
              return (
                <div key={item} style={{ width: "fit-content" }}>
                  <Checkbox.Item value={item}>{item}</Checkbox.Item>
                </div>
              );
            })}
          </Checkbox>
          <Container.Flex style={{ alignItems: "center", gap: "10px" }}>
            <Increment value={quantity} setValue={setQuantity} />
            <button className="btn-add-to-cart" onClick={handleOrder}>
              Order
            </button>
          </Container.Flex>
        </div>
      </div>
      <div>
        <Container.Flex>
          <label>Description: </label>
          <ReadMoreLess style={{ height: "150px" }}>
            <p>
              {product.description}
              As we said in Part 4, a Redux middleware can do anything when it
              sees a dispatched action: log something, modify the action, delay
              the action, make an async call, and more. Also, since middleware
              form a pipeline around the real store.dispatch function, this also
              means that we could actually pass something that isn't a plain
              action object to dispatch, as long as a middleware intercepts that
              value and doesn't let it reach the reducers. Middleware also have
              access to dispatch and getState. That means you could write some
              async logic in a middleware, and still have the ability to
              interact with the Redux store by dispatching actions.
            </p>
          </ReadMoreLess>
        </Container.Flex>
      </div>
      <div className="rating">
        <Rating rated={4} />
        <div className="count">{product.rating.count}</div>
      </div>
      <CommentSection url={"https://jsonplaceholder.typicode.com/comments"} />
    </div>
  );
}
