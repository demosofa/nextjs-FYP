import axios from "axios";
import { useContext, useRef, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import {
  FileUpload,
  TagsInput,
  Form,
  Container,
  Loading,
} from "../../../components";
import { Variation, Variant } from "../../../containers";
import { Notification } from "../../../Layout";
import { retryAxios, Validate, uploadApi } from "../../../utils";
import { useAxiosLoad } from "../../../hooks";
import { Media } from "../../_app";
import { useSelector, useDispatch } from "react-redux";
import { editAllVariations } from "../../../redux/reducer/variationSlice";
import { addNotification } from "../../../redux/reducer/notificationSlice";

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
    categories: "",
    status: "",
    tags: [],
    images: [],
    manufacturer: "",
    price: 0,
    quantity: 0,
  });

  const { device, Devices } = useContext(Media);

  const { loading: isLoading } = useAxiosLoad({
    config: {
      baseURL: `${LocalApi}/category`,
      method: "GET",
    },
    callback: async (instance) => {
      arrCategory.current = (await instance()).data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploaded;
    try {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));
      retryAxios(axios);
      uploaded = await Promise.all(
        input.images.map((image) => {
          return uploadApi(axios, {
            path: "store",
            file: image,
          });
        })
      );
      const newInput = { ...input, variants, variations, images: uploaded };
      await axios.post(`${LocalApi}/product`, newInput, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      router.push("/product");
    } catch (error) {
      const arrPublic_id = uploaded.map((item) => item.public_id);
      await axios.post(`${LocalApi}/destroy`, {
        path: "store",
        files: arrPublic_id,
      });
      dispatch(addNotification({ message: error.message }));
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
    <>
      <Notification />
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
              prevFiles={input.images}
              setPrevFiles={(images) =>
                setInput((prev) => ({ ...prev, images }))
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

            <Variant />
            <Form.Button
              onClick={() =>
                dispatch(
                  editAllVariations({
                    price: input.price,
                    quantity: input.quantity,
                  })
                )
              }
            >
              Apply Price and Quantity to all Variations
            </Form.Button>
            <Variation />
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
                  setInput((prev) => ({
                    ...prev,
                    manufacturer: e.target.value,
                  }))
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

        {JSON.stringify([variants, variations])}

        <Form.Item style={{ justifyContent: "flex-start" }}>
          <Form.Submit>Submit</Form.Submit>
          <Form.Button onClick={() => setInput(null)}>Cancel</Form.Button>
        </Form.Item>
      </Form>
    </>
  );
}
