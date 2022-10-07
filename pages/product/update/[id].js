import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import { Form } from "../../../components";
import { UpdateImage, UpdateVariation } from "../../../containers";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addNotification } from "../../../redux/reducer/notificationSlice";
import { withAuth } from "../../../helpers";
import { retryAxios } from "../../../utils";

const LocalApi = process.env.NEXT_PUBLIC_API;

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
    const { _id, description, quantity, sale, time } = product;
    retryAxios(axios);
    try {
      await axios.put(`${LocalApi}/product`, {
        _id,
        description,
        quantity,
        sale,
        time,
      });
      router.back();
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  return (
    <Form
      style={{ maxWidth: "800px", margin: "20px auto" }}
      onSubmit={handleSubmit}
    >
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
          value={
            product.time &&
            new Date(product.time)
              .toISOString()
              .toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
              })
              .split("T")[0]
          }
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, time: e.target.value }))
          }
        ></Form.Input>
      </Form.Item>
      <div className="flex w-full gap-4 sm:gap-0">
        <div
          className="card flex-1 cursor-pointer items-center"
          onClick={() => setToggle("image")}
        >
          Update Product Image
        </div>
        <div
          className="card flex-1 cursor-pointer items-center"
          onClick={() => setToggle("variation")}
        >
          Update Product Variation
        </div>
      </div>
      {(toggle !== null && toggle === "image" && (
        <UpdateImage productId={router.query?.id} setToggle={setToggle} />
      )) ||
        (toggle === "variation" && (
          <UpdateVariation productId={router.query?.id} setToggle={setToggle} />
        ))}
      <Form.Item>
        <Form.Submit>Submit</Form.Submit>
        <Form.Button onClick={() => router.back()}>Cancel</Form.Button>
      </Form.Item>
    </Form>
  );
}
