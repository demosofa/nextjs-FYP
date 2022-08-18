import axios from "axios";
import Head from "next/head";
import { useCallback, useContext, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import { FileUpload, TagsInput, Form, Container } from "../../../components";
import { Variation, Variant, SelectCategory } from "../../../containers";
import { Notification } from "../../../Layout";
import { retryAxios, Validate, uploadApi } from "../../../utils";
import { Media } from "../../_app";
import { useSelector, useDispatch } from "react-redux";
import { editAllVariations } from "../../../redux/reducer/variationSlice";
import { addNotification } from "../../../redux/reducer/notificationSlice";
import Select from "react-select";
import dynamic from "next/dynamic";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function CreateForm() {
  const variants = useSelector((state) => state.variant);
  const variations = useSelector((state) => state.variation);
  const router = useRouter();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    title: "",
    description: "",
    categories: [],
    status: "",
    tags: [],
    images: [],
    manufacturer: "",
    price: 0,
    quantity: 0,
  });

  const { device, Devices } = useContext(Media);

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

  const handleSelectedCategories = useCallback(
    (index, categoryId) => {
      setInput((prev) => {
        const { images, ...other } = prev;
        const clone = JSON.parse(JSON.stringify(other));
        if (!categoryId) {
          const updatedCategories = clone.categories.filter(
            (_, i) => i < index
          );
          clone.categories = updatedCategories;
        } else clone.categories[index] = categoryId;
        return { ...clone, images };
      });
    },
    [input.categories]
  );
  return (
    <>
      <Head>
        <title>Create Product</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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
              <Select
                defaultValue={{ value: "active", label: "active" }}
                onChange={({ value }) =>
                  setInput((prev) => ({ ...prev, status: value }))
                }
                options={[
                  { value: "active", label: "active" },
                  { value: "non-active", label: "non-active" },
                  { value: "out", label: "out" },
                ]}
              />
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
              <SelectCategory
                setSelectedCategories={handleSelectedCategories}
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

        {JSON.stringify(input)}

        <Form.Item style={{ justifyContent: "flex-start" }}>
          <Form.Submit>Submit</Form.Submit>
          <Form.Button onClick={() => setInput(null)}>Cancel</Form.Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default dynamic(() => Promise.resolve(CreateForm), { ssr: false });
