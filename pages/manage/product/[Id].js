import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import {
  FileUpload,
  TagsInput,
  Form,
  Container,
  Icon,
} from "../../../components";
import { Validate } from "../../../utils";

const Api = process.env.LOCAL_API;

export async function getServerSideProps({ params }) {
  let product = null;
  const id = params.Id;
  if (id === "create")
    return {
      props: {
        product,
      },
    };
  const data = await fetch(`${Api}/productcrud/${id}`);
  product = await data.json();
  return {
    props: {
      product,
    },
  };
}

export default function CreateEditForm({ product }) {
  const [input, setInput] = useState(() => {
    if (product !== null) return product;
    return {
      id: "",
      title: "",
      description: "",
      thumbnail: null,
      tags: [],
      files: [],
      price: 0,
      inventory: 0,
    };
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    Object.entries(input).forEach((field) => {
      let key = field[0];
      const value = field[1];
      if (value instanceof Array) {
        for (var i = 0; i < value.length; i++) {
          formdata.append(key, value[i]);
        }
      } else formdata.append(key, value);
    });
    formdata.append("status", "non-active");
    // for (var pair of formdata.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    try {
      if (product === null) {
        axios
          .post(`${Api}/productcrud`, formdata, {
            headers: {
              // Authorization: `Bearer`,
              "Content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            router.push("/manage/product");
          });
      } else {
        axios
          .put(`${Api}/productcrud/${input.id}`, formdata, {
            headers: {
              // Authorization: `Bearer`,
              "Content-type": "multipart/form-data",
            },
          })
          .then((res) => {});
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form
      className="create_edit"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      style={{ "max-width": "none", width: "auto", margin: "0 20%" }}
    >
      <Form.Title style={{ fontSize: "20px" }}>
        {product === null ? "Create Product" : `Edit Prodcut`}
      </Form.Title>

      <Form.Item>
        <Form.Title>Title</Form.Title>
        <Form.Input
          value={input.title}
          onChange={(e) =>
            setInput((prev) => {
              return { ...prev, title: e.target.value };
            })
          }
        />
      </Form.Item>

      <Form.Item>
        <Form.Title>Description</Form.Title>
        <Form.TextArea
          value={input.description}
          onChange={(e) =>
            setInput((prev) => {
              return { ...prev, description: e.target.value };
            })
          }
        />
      </Form.Item>

      <Form.Item>
        <Form.Title>Status</Form.Title>
        <Form.Select
          onChange={(e) =>
            setInput((prev) => {
              return { ...prev, status: e.target.value };
            })
          }
        >
          <Form.Option value="active">active</Form.Option>
          <Form.Option value="non-active">non-active</Form.Option>
          <Form.Option value="out">out</Form.Option>
        </Form.Select>
      </Form.Item>

      <Form.Item style={{ justifyContent: "flex-start" }}>
        <Form.Title style={{ marginBottom: 0 }}>Tags</Form.Title>
        <TagsInput
          prevTags={input.tags}
          setPrevTags={(tags) =>
            setInput((prev) => {
              return { ...prev, tags: tags };
            })
          }
        />
      </Form.Item>

      <FileUpload
        prevFiles={input.files}
        setPrevFiles={(files) =>
          setInput((prev) => {
            return { ...prev, files: files };
          })
        }
      >
        <FileUpload.Show></FileUpload.Show>
        <FileUpload.Input
          id="file_input"
          multiple
          style={{
            display: "none",
          }}
        >
          <label htmlFor="file_input" className="add_file__btn">
            <AiOutlinePlus style={{ width: "30px", height: "30px" }} />
          </label>
        </FileUpload.Input>
      </FileUpload>

      <Form.Item>
        <Form.Item>
          <Form.Title>Price</Form.Title>
          <Form.Input
            value={input.price}
            onChange={(e) =>
              setInput((prev) => {
                return { ...prev, price: e.target.value };
              })
            }
          />
        </Form.Item>

        <Form.Item>
          <Form.Title>Quantity</Form.Title>
          <Form.Input
            value={input.quantity}
            onChange={(e) =>
              setInput((prev) => {
                return { ...prev, quantity: e.target.value };
              })
            }
          />
        </Form.Item>
      </Form.Item>

      <Form.Item style={{ justifyContent: "flex-start" }}>
        <Form.Submit>Submit</Form.Submit>
        <Form.Button onClick={() => setToggle(null)}>Cancel</Form.Button>
      </Form.Item>
    </Form>
  );
}
