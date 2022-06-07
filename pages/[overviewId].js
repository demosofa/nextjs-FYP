import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/reducer/CartSlice";
import {
  ImageMagnifier,
  Comment,
  Checkbox,
  Container,
  ReadMoreLess,
  Rating,
  Increment,
  Slider,
  Timer,
} from "../components";
import { Media } from "../Layout";

export async function getServerSideProps({ params }) {
  const data = await fetch(
    `https://fakestoreapi.com/products/${params.overviewId}`
  );
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
  const [option, setOption] = useState();

  const { device, Devices } = useContext(Media);

  const dispatch = useDispatch();
  const handleOrder = () => {
    const { id, title, image, price } = product;
    dispatch(
      addProduct({
        id,
        title,
        image,
        quantity,
        price,
        total: quantity * price,
      })
    );
  };

  return (
    <div className="page-overview">
      <div className="container-info">
        <div className="preview-product">
          <ImageMagnifier
            src={image || product.image}
            style={{ maxWidth: "300px", height: "350px" }}
            className="product-img"
          ></ImageMagnifier>
          {/* <Slider
            config={{
              vertical: device !== Devices.phone ? true : false,
              slides: { perView: 3 },
            }}
          >
            <Slider.Content className="slider">
              {[].map((src, index) => (
                <img key={index} src={src}></img>
              ))}
            </Slider.Content>
          </Slider> */}
        </div>
        <div className="product-info">
          <label>{product.title}</label>
          <Timer value={new Date(2022, 6, 22, 4).getTime()} />
          <Container.Flex style={{ gap: "10px" }}>
            <label>Price: </label>
            <div>{product.price} $</div>
          </Container.Flex>
          <Container.Flex style={{ gap: "10px" }}>
            <label>Category: </label>
            <div className="categrory">{product.category}</div>
          </Container.Flex>
          <Checkbox
            type="radio"
            name="size"
            style={{ display: "flex", justifyContent: "space-between" }}
            setChecked={(value) => setOption(value.join(""))}
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
              style={{ flex: 2 }}
              className="btn-add-to-cart"
              onClick={handleOrder}
            >
              Order
            </button>
          </Container.Flex>
        </div>
      </div>
      <div>
        <Container.Flex>
          <label>Description: </label>
          <ReadMoreLess style={{ height: "150px" }}>
            <p>{product.description}</p>
          </ReadMoreLess>
        </Container.Flex>
      </div>
      <div className="rating">
        <Rating rated={4} />
        <div className="count">{product.rating.count}</div>
      </div>
      <Comment url={"https://jsonplaceholder.typicode.com/comments"} />
    </div>
  );
}
