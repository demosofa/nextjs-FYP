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

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export const getServerSideProps = withAuth(({req, params}, role) => {
  let value = null;
  console.log(req.headers)
  try {
    const response = await axios.get(`${LocalApi}/product/${params}`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    value = response.data;
  } catch (error) {
    console.log(error.message);
  }
  return {
    props: {
      value,
      role,
    },
  };
});

export default function UpdateProduct({value}) {
  const [data, setData] = useState(value)
  const [toggle, setToggle] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    retryAxios(axios);
    try {
      await axios.put(`${LocalApi}/product`, data);
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
          value={data.description}
          onChange={(e) =>
            setData((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </Form.Item>
      <Form.Item>
        <Form.Title>Sale Price</Form.Title>
        <Form.Input
          value={data.sale}
          onChange={(e) =>
            setData((prev) => ({ ...prev, sale: e.target.value }))
          }
        ></Form.Input>
      </Form.Item>
      <Form.Item>
        <Form.Title>TimeStamp</Form.Title>
        <Form.Input
          value={data.time}
          onChange={(e) =>
            setData((prev) => ({ ...prev, time: e.target.value }))
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
