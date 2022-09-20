import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Form, Loading } from "../../../components";
import { UpdateImage, UpdateVariation } from "../../../containers";
import dynamic from "next/dynamic";
import { useAuthLoad } from "../../../hooks";
import { expireStorage, retryAxios } from "../../../utils";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addNotification } from "../../../redux/reducer/notificationSlice";
import { Role } from "../../../shared";

const LocalApi = process.env.NEXT_PUBLIC_API;

function UpdateProduct() {
  const [product, setProduct] = useState();
  const [toggle, setToggle] = useState(null);
  const router = useRouter();
  const { loading, isLoggined, isAuthorized } = useAuthLoad({
    async cb(axiosInstance) {
      const res = await axiosInstance({
        url: `${LocalApi}/product/${router.query?.id}`,
      });
      setProduct(res.data);
    },
    roles: [Role.admin],
    deps: [router.isReady],
  });

  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _id, description, quantity, sale, time } = product;
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    try {
      await axios.put(
        `${LocalApi}/product`,
        { _id, description, quantity, sale, time },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      router.back();
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  useEffect(() => {
    if (!loading && !isLoggined && !isAuthorized) router.push("/login");
    else if (!loading && !isAuthorized) router.back();
  }, [loading, isLoggined, isAuthorized]);

  if (loading || !isLoggined || !isAuthorized)
    return (
      <Loading
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%)`,
        }}
      ></Loading>
    );

  return (
    <Form style={{ maxWidth: "800px" }} onSubmit={handleSubmit}>
      <Head>
        <title>Update Product</title>
      </Head>
      <Form.Title style={{ fontSize: "20px" }}>Update Product</Form.Title>
      <Form.Item style={{ flexDirection: "column" }}>
        <Form.Title>Description</Form.Title>
        <Form.TextArea
          value={product.description}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <label>{`${product.description.length}/1000`}</label>
      </Form.Item>
      <Form.Item>
        <Form.Title>Quantity</Form.Title>
        <Form.Input
          value={product.quantity}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, quantity: e.target.value }))
          }
        ></Form.Input>
      </Form.Item>
      <Form.Item>
        <Form.Title>Sale Price</Form.Title>
        <Form.Input
          value={product.sale}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, sale: e.target.value }))
          }
        ></Form.Input>
      </Form.Item>
      <Form.Item>
        <Form.Title>TimeStamp</Form.Title>
        <Form.Input
          type="date"
          value={product.time}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, time: e.target.value }))
          }
        ></Form.Input>
      </Form.Item>
      <div className="card" onClick={() => setToggle("image")}>
        Update Product Image
      </div>
      <div className="card" onClick={() => setToggle("variation")}>
        Update Product Variation
      </div>
      {(toggle !== null && toggle === "image" && (
        <UpdateImage productId={router.query?.id} setToggle={setToggle} />
      )) ||
        (toggle === "variation" && (
          <UpdateVariation productId={router.query?.id} setToggle={setToggle} />
        ))}
      <Form.Submit>Submit</Form.Submit>
    </Form>
  );
}

export default dynamic(() => Promise.resolve(UpdateProduct), { ssr: false });
