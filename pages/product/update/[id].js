import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import { Form } from "../../../components";
import { UpdateImage, UpdateVariation } from "../../../containers";
import styles from "../../../styles/Home.module.scss";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addNotification } from "../../../redux/reducer/notificationSlice";
import { withAuth } from "../../../helpers";
import { retryAxios } from "../../../utils";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export const getServerSideProps = withAuth(async ({ req, params }, role) => {
  let value = null;
  try {
    const response = await axios.get(`${LocalApi}/product/${params.id}`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    value = response.data;
  } catch (error) {}
  return {
    props: {
      value,
      role,
    },
  };
});

export default function UpdateProduct({ value }) {
  const [product, setProduct] = useState(value);
  const [toggle, setToggle] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _id, description, sale, time } = product;
    retryAxios(axios);
    try {
      await axios.put(`${LocalApi}/product`, { _id, description, sale, time });
      router.back();
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  return (
    <Form style={{ maxWidth: "800px" }} onSubmit={handleSubmit}>
      <Head>
        <title>Update Product</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Form.Title style={{ fontSize: "20px" }}>Update Product</Form.Title>
      <Form.Item>
        <Form.Title>Description</Form.Title>
        <Form.TextArea
          value={product.description}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, description: e.target.value }))
          }
        />
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
      <div className={styles.card} onClick={() => setToggle("image")}>
        Update Product Image
      </div>
      <div className={styles.card} onClick={() => setToggle("variation")}>
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
