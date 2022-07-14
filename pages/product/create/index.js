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
  Variation,
  Variant,
} from "../../../components";
import { Validate } from "../../../utils";
import { useUpload } from "../../../hooks";
import { useSelector } from "react-redux";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function CreateForm() {
  const variants = useSelector((state) => state.variant);
  const variations = useSelector((state) => state.variation);
  const [input, setInput] = useState({
    id: "",
    title: "",
    description: "",
    variants,
    variations,
    thumbnail: [],
    categories: "",
    status: "",
    tags: [],
    files: [],
    price: 0,
    quantity: 0,
  });

  const [loading, getFiles, previews, deleteFile] = useUpload(
    input.thumbnail,
    (thumbnail) =>
      setInput((prev) => {
        return { ...prev, thumbnail: thumbnail[0] };
      }),
    {
      size: 2,
      total: 1,
    }
  );

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
    // for (var pair of formdata.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    try {
      axios
        .post(`${LocalApi}/productcrud`, formdata, {
          headers: {
            // Authorization: `Bearer`,
            "Content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          router.push("/product");
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form
      className="create_edit"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      style={{ maxWidth: "none", width: "auto", margin: "0 10%" }}
    >
      <Form.Title style={{ fontSize: "20px" }}>Create Product</Form.Title>

      <Container.Flex style={{ justifyContent: "space-around", gap: "40px" }}>
        <Container.Flex
          style={{ flex: 1.8, flexDirection: "column", gap: "25px" }}
        >
          <Container.Flex style={{ justifyContent: "space-between" }}>
            <Form.Item>
              <Form.Title>Thumbnail</Form.Title>
              <div className="thumbnail_upload">
                {!input.thumbnail && (
                  <label
                    className="add_file__btn"
                    style={{ width: "100%", height: "100%" }}
                  >
                    Click to add thumbnail
                    <input
                      type="file"
                      onChange={(e) => getFiles(e.target.files)}
                      style={{ display: "none" }}
                    ></input>
                  </label>
                )}
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    style={{ width: "100%", height: "100%" }}
                    onClick={(e) => deleteFile(e, index)}
                  >
                    <img
                      src={preview}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "6px",
                      }}
                    ></img>
                  </div>
                ))}
              </div>
            </Form.Item>

            <Form.Item>
              <Form.Title>Title</Form.Title>
              <Form.Input
                value={input.title}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Form.Item>
          </Container.Flex>

          <Form.Item>
            <Form.Title>Description</Form.Title>
            <Form.TextArea
              value={input.description}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </Form.Item>

          <FileUpload
            prevFiles={input.files}
            setPrevFiles={(files) =>
              setInput((prev) => ({ ...prev, files: files }))
            }
            style={{ maxWidth: "500px", height: "200px" }}
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

          <Variant
            setVariants={(items) =>
              setInput((prev) => ({
                ...prev,
                variants: items.map((item) => JSON.stringify(item)),
              }))
            }
          ></Variant>

          <Variation
            setVariations={(items) =>
              setInput((prev) => ({
                ...prev,
                variations: items.map((item) => JSON.stringify(item)),
              }))
            }
          />
        </Container.Flex>

        <Container.Flex
          style={{
            flex: 1,
            flexDirection: "column",
            gap: "25px",
            position: "sticky",
            top: 0,
            maxHeight: "300px",
          }}
        >
          <Form.Item>
            <Form.Title>Status</Form.Title>
            <Form.Select
              value={input.status}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <Form.Option value="active">active</Form.Option>
              <Form.Option value="non-active">non-active</Form.Option>
              <Form.Option value="out">out</Form.Option>
            </Form.Select>
          </Form.Item>

          <Form.Item>
            <Form.Title>Price</Form.Title>
            <Form.Input
              value={input.price}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </Form.Item>

          <Form.Item>
            <Form.Title>Quantity</Form.Title>
            <Form.Input
              value={input.quantity}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, quantity: e.target.value }))
              }
            />
          </Form.Item>

          <Form.Item style={{ justifyContent: "flex-start" }}>
            <Form.Title style={{ marginBottom: 0 }}>Tags</Form.Title>
            <TagsInput
              prevTags={input.tags}
              setPrevTags={(tags) =>
                setInput((prev) => ({ ...prev, tags: tags }))
              }
            />
          </Form.Item>
        </Container.Flex>
      </Container.Flex>

      {JSON.stringify(input)}

      <Form.Item style={{ justifyContent: "flex-start" }}>
        <Form.Submit>Submit</Form.Submit>
        <Form.Button onClick={() => setInput(null)}>Cancel</Form.Button>
      </Form.Item>
    </Form>
  );
}