import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Form, Loading, TagsInput } from "../../../frontend/components";
import { UpdateImage, UpdateVariation } from "../../../frontend/containers";
import dynamic from "next/dynamic";
import { useAuthLoad } from "../../../frontend/hooks";
import { expireStorage, retryAxios, Validate } from "../../../frontend/utils";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addNotification } from "../../../frontend/redux/reducer/notificationSlice";
import { Role } from "../../../shared";

const LocalApi = process.env.NEXT_PUBLIC_API;

function UpdateProduct() {
  const [product, setProduct] = useState();
  const [toggle, setToggle] = useState(null);
  const router = useRouter();
  const { loading, isLoggined, authorized } = useAuthLoad({
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
  const validateInput = () => {
    const { description, manufacturer } = product;
    Object.entries({ description, manufacturer }).forEach((entry) => {
      switch (entry[0]) {
        case "description":
          new Validate(entry[1]).isEmpty().isEnoughLength({ max: 1000 });
          break;
        case "manufacturer":
          new Validate(entry[1]).isEmpty().isNotSpecial();
          break;
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _id, description, tags } = product;
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    try {
      validateInput();
      await axios.put(
        `${LocalApi}/product`,
        { _id, description, tags },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      router.back();
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  useEffect(() => {
    if (!loading && !isLoggined && !authorized) router.push("/login");
    else if (!loading && !authorized) router.back();
  }, [loading, isLoggined, authorized]);

  if (loading || !isLoggined || !authorized)
    return (
      <Loading
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%)`,
        }}
      />
    );

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
        <Form.Title>Tags</Form.Title>
        <TagsInput
          prevTags={product.tags}
          setPrevTags={(tags) =>
            setProduct((prev) => ({ ...prev, tags: tags }))
          }
        />
      </Form.Item>
      <Form.Item>
        <Form.Title>Manufacturer</Form.Title>
        <Form.Input
          value={product.manufacturer}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, manufacturer: e.target.value }))
          }
        />
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

export default dynamic(() => Promise.resolve(UpdateProduct), { ssr: false });
