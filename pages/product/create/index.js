import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
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
  Loading,
} from "../../../components";
import { retryAxios, Validate } from "../../../utils";
import { useAxiosLoad, useUpload } from "../../../hooks";
import { Media } from "../../_app";
import { useSelector, useDispatch } from "react-redux";
import { editAllVariations } from "../../../redux/reducer/variationSlice";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function CreateForm() {
  const variants = useSelector((state) => state.variant);
  const variations = useSelector((state) => state.variation);
  const arrCategory = useRef([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    title: "",
    description: "",
    variants,
    variations,
    thumbnail: [],
    categories: "",
    status: "",
    tags: [],
    files: [],
    manufacturer: "",
    price: 0,
    quantity: 0,
  });

  const { device, Devices } = useContext(Media);

  const {
    files: Thumbnail,
    getFiles,
    previews,
    handleDelete: deleteFile,
  } = useUpload(input.thumbnail, {
    size: 2,
    total: 1,
  });

  useEffect(
    () => setInput((prev) => ({ ...prev, thumbnail: Thumbnail[0] })),
    [Thumbnail]
  );

  const { loading: isLoading } = useAxiosLoad({
    config: {
      baseURL: `${LocalApi}/category`,
      method: "GET",
    },
    callback: async (instance) => {
      arrCategory.current = (await instance()).data.categories;
    },
  });

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
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    try {
      retryAxios(axios);
      axios
        .post(`${LocalApi}/productcrud`, formdata, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
  if (isLoading)
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
    <Form
      className="create_edit"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: "none",
        width: "auto",
        margin:
          (device === Devices.pc && "0 10%") ||
          (device === Devices.tablet && "0 7%") ||
          "0",
      }}
    >
      <Form.Title style={{ fontSize: "20px" }}>Create Product</Form.Title>

      <Container.Grid style={{ gap: "40px" }}>
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
            style={{ height: "200px" }}
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
            <Form.Title>Manufacturer</Form.Title>
            <Form.Input
              value={input.manufacturer}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, manufacturer: e.target.value }))
              }
            />
          </Form.Item>

          <Form.Item>
            <Form.Title>Category</Form.Title>
            <Form.Select
              onChange={(e) =>
                setInput((prev) => ({ ...prev, categories: e.target.value }))
              }
            >
              {arrCategory.current.map((category) => {
                return (
                  <Form.Option key={category._id} value={category._id}>
                    {category.name}
                  </Form.Option>
                );
              })}
            </Form.Select>
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

          <Form.Item>
            <Form.Title>Price</Form.Title>
            <Form.Input
              value={input.price}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, price: e.target.value }))
              }
            ></Form.Input>
          </Form.Item>

          <Form.Item>
            <Form.Title>Quantity</Form.Title>
            <Form.Input
              value={input.quantity}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, quantity: e.target.value }))
              }
            ></Form.Input>
          </Form.Item>
        </Container.Flex>
      </Container.Grid>

      <Variant
        setVariants={(items) =>
          setInput((prev) => ({
            ...prev,
            variants: items?.map((item) => JSON.stringify(item)),
          }))
        }
      ></Variant>

      <Form.Button
        onClick={() =>
          dispatch(
            editAllVariations({ price: input.price, quantity: input.quantity })
          )
        }
      >
        Apply Price and Quantity to all Variations
      </Form.Button>

      <Variation
        setVariations={(items) =>
          setInput((prev) => ({
            ...prev,
            variations: items?.map((item) => JSON.stringify(item)),
          }))
        }
      />

      {JSON.stringify(input)}

      <Form.Item style={{ justifyContent: "flex-start" }}>
        <Form.Submit>Submit</Form.Submit>
        <Form.Button onClick={() => setInput(null)}>Cancel</Form.Button>
      </Form.Item>
    </Form>
  );
}
