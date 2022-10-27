import axios from "axios";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import { FileUpload, TagsInput, Form } from "../../components";
import { Variation, Variant, SelectCategory } from "../../containers";
import {
  retryAxios,
  Validate,
  uploadApi,
  expireStorage,
  validateVariations,
} from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { editAllVariations } from "../../redux/reducer/variationSlice";
import { addNotification } from "../../redux/reducer/notificationSlice";
import Select from "react-select";
import dynamic from "next/dynamic";
import { deleteAllVariant } from "../../redux/reducer/variantSlice";
import { useMediaContext } from "../../contexts/MediaContext";
import { currencyFormat, Role } from "../../shared";
import { useAuthLoad } from "../../hooks";

const LocalApi = process.env.NEXT_PUBLIC_API;

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
    cost: 0,
    length: 0,
    width: 0,
    height: 0,
    quantity: 0,
  });

  const { device, Devices } = useMediaContext();

  const validateVariant = () => {
    if (variants.length) {
      variants.forEach(({ name, options }) => {
        if (!name) throw new Error("Please add value name for Variant");
        if (!options.length)
          throw new Error("Please add value options for Variant " + name);
      });
    }
  };

  const validateInput = () => {
    const {
      title,
      description,
      status,
      manufacturer,
      price,
      cost,
      length,
      width,
      height,
      quantity,
    } = input;
    let validate = { title, description, status, manufacturer };
    if (!variations.length)
      validate = { ...validate, price, cost, length, width, height, quantity };
    Object.entries(validate).forEach((entry) => {
      switch (entry[0]) {
        case "title":
          new Validate(entry[1]).isEmpty().isEnoughLength({ max: 255 });
          break;
        case "description":
          new Validate(entry[1]).isEmpty().isEnoughLength({ max: 1000 });
          break;
        case "status":
        case "manufacturer":
          new Validate(entry[1]).isEmpty();
          break;
        case "price":
        case "cost":
          new Validate(entry[1]).isEmpty().isVND();
          break;
        case "length":
        case "width":
        case "height":
        case "quantity":
          new Validate(entry[1]).isEmpty().isNumber();
          break;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploaded = [];
    try {
      if (!input.categories.length) throw new Error("Please select categories");
      validateVariant();
      validateVariations(variations);
      validateInput();
      const accessToken = expireStorage.getItem("accessToken");
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
      dispatch(deleteAllVariant());
      router.back();
    } catch (error) {
      if (uploaded.length) {
        const arrPublic_id = uploaded.map((item) => item.public_id);
        await axios.post(`${LocalApi}/destroy`, {
          path: "store",
          files: arrPublic_id,
        });
      }
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  const handleSelectedCategories = useCallback((index, categoryId) => {
    setInput((prev) => {
      const { images, ...other } = prev;
      const clone = JSON.parse(JSON.stringify(other));
      if (!categoryId) {
        const updatedCategories = clone.categories.filter((_, i) => i < index);
        clone.categories = updatedCategories;
      } else clone.categories[index] = categoryId;
      return { ...clone, images };
    });
  }, []);

  const { loading, isLoggined, isAuthorized, error } = useAuthLoad({
    roles: [Role.admin],
  });
  useEffect(() => {
    if (!loading && !isLoggined) router.push("/login");
    else if (!loading && isLoggined && !isAuthorized) router.back();
    else if (error) router.push("/register");
  }, [loading, isLoggined, isAuthorized, error]);

  return (
    <>
      <Head>
        <title>Create Product</title>
      </Head>
      <Form
        className="create_edit"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "none",
          width: "auto",
          margin:
            (device === Devices.pc && "0 9%") ||
            (device === Devices.tablet && "0 7%") ||
            "0",
        }}
      >
        <Form.Title style={{ fontSize: "20px" }}>Create Product</Form.Title>
        <div className="flex flex-1.8 flex-col gap-6">
          <div className="flex flex-wrap justify-between">
            <Form.Item>
              <Form.Title>Title</Form.Title>
              <Form.Input
                value={input.title}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Form.Item>
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
          </div>

          <div className="flex flex-wrap justify-between">
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
          </div>

          <Form.Item style={{ flexDirection: "column" }}>
            <Form.Title>Description</Form.Title>
            <Form.TextArea
              value={input.description}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            <label>{`${input.description.length}/1000`}</label>
          </Form.Item>

          <FileUpload
            prevFiles={input.images}
            setPrevFiles={(images) => setInput((prev) => ({ ...prev, images }))}
            style={{ width: "100%" }}
          >
            <FileUpload.Show />
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
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col">
              <Form.Title className="mx-auto text-lg">Information</Form.Title>
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
                <Form.Title>Quantity</Form.Title>
                <Form.Input
                  value={input.quantity}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                />
              </Form.Item>

              <Form.Item>
                <Form.Title>Length</Form.Title>
                <Form.Input
                  value={input.length}
                  onChange={(e) =>
                    setInput((prev) => ({ ...prev, length: e.target.value }))
                  }
                />
              </Form.Item>

              <Form.Item>
                <Form.Title>Width</Form.Title>
                <Form.Input
                  value={input.width}
                  onChange={(e) =>
                    setInput((prev) => ({ ...prev, width: e.target.value }))
                  }
                />
              </Form.Item>

              <Form.Item>
                <Form.Title>Height</Form.Title>
                <Form.Input
                  value={input.height}
                  onChange={(e) =>
                    setInput((prev) => ({ ...prev, height: e.target.value }))
                  }
                />
              </Form.Item>
            </div>

            <div className="flex flex-col">
              <Form.Title className="mx-auto text-lg">Pricing</Form.Title>
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
                <Form.Title>Cost</Form.Title>
                <Form.Input
                  value={input.cost}
                  onChange={(e) =>
                    setInput((prev) => ({ ...prev, cost: e.target.value }))
                  }
                />
              </Form.Item>
              <dl>
                <dt>Margin</dt>
                <dd>{Math.ceil(100 - (input.cost / input.price) * 100)}%</dd>
                <dt>Profit</dt>
                <dd>{currencyFormat(input.price - input.cost)}</dd>
              </dl>
            </div>
          </div>

          <Variant />
          <Form.Button
            onClick={() =>
              dispatch(
                editAllVariations({
                  price: input.price,
                  cost: input.cost,
                  length: input.length,
                  width: input.width,
                  height: input.height,
                  quantity: input.quantity,
                })
              )
            }
          >
            Apply all Info to all Variations
          </Form.Button>
          <Variation />
        </div>

        <Form.Item style={{ justifyContent: "flex-start" }}>
          <Form.Submit>Submit</Form.Submit>
          <Form.Button
            onClick={() => {
              dispatch(deleteAllVariant());
              router.back();
            }}
          >
            Cancel
          </Form.Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default dynamic(() => Promise.resolve(CreateForm), { ssr: false });
