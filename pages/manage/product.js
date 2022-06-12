import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  FileUpload,
  TagsInput,
  Pagination,
  Form,
  Container,
  Search,
} from "../../components";
import { Validate } from "../../utils";

export async function getServerSideProps() {
  const datas = await fetch(`http://localhost:3000/api/productcrud`);
  const value = await datas.json();
  return {
    props: {
      value,
    },
  };
}

export default function ProductCRUD({ value }) {
  const [products, setProducts] = useState([
    {
      id: "",
      title: "T-shirt",
      description: "its type of shirt",
      tags: ["shirt"],
      files: [],
      price: 2000,
      quantity: 40,
    },
  ]);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(null);
  const [remove, setRemove] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  return (
    <div className="product-crud__container">
      <Container.Flex>
        <button onClick={setCreate}>Create</button>
        <Search />
      </Container.Flex>
      <div className="product-crud__table">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Title</th>
              <th>Description</th>
              <th>Tags</th>
              <th>Files</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.title}</td>
                  <td className="ellipse">{product.description}</td>
                  <td className="ellipse">{product.tags.join(", ")}</td>
                  <td>{product.files.length}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button onClick={() => router.push("/overview")}>
                      Preview
                    </button>
                    <button onClick={() => setEdit(index)}>Edit</button>
                    <button onClick={() => setRemove(index)}>Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {create && (
          <CreateEditForm
            products={products}
            setProducts={setProducts}
            setToggle={() => setCreate(false)}
          />
        )}
        {edit !== null && (
          <CreateEditForm
            index={edit}
            product={products[edit]}
            setProducts={setProducts}
            setToggle={setEdit}
          />
        )}
        {remove !== null && (
          <Remove
            index={remove}
            product={products[remove]}
            setProducts={setProducts}
            setRemove={setRemove}
          />
        )}
      </div>
      <Pagination
        totalPageCount={10}
        currentPage={currentPage}
        setCurrentPage={(page) => setCurrentPage(page)}
      >
        <Pagination.Arrow>
          <Pagination.Number />
        </Pagination.Arrow>
      </Pagination>
    </div>
  );
}

function CreateEditForm({ product, setProducts, index = null, setToggle }) {
  const [input, setInput] = useState(() => {
    if (index !== null) return product;
    return {
      id: "",
      title: "",
      description: "",
      tags: [],
      files: [],
      price: 0,
      quantity: 0,
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    Object.entries(input).forEach((field) => {
      let key = field[0];
      const value = field[1];
      if (value instanceof Array) {
        key = key + "[]";
        for (var i = 0; i < value.length; i++) {
          formdata.append(key, value[i]);
        }
      } else formdata.append(key, value);
    });
    // for (var pair of formdata.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    try {
      if (index === null) {
        axios
          .post(`http://localhost:3000/api/productcrud`, formdata, {
            headers: {
              // Authorization: `Bearer`,
              "Content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            setProducts((prev) => [...prev, input]);
          });
      } else {
        axios
          .put(`http://localhost:3000/api/productcrud/${input.id}`, formdata, {
            headers: {
              // Authorization: `Bearer`,
              "Content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            setProducts((prev) => {
              const newArr = prev.concat();
              newArr[index] = input;
              return [...newArr];
            });
          });
      }
    } catch (error) {
      console.log(error);
    }
    setToggle(null);
  };
  return (
    <>
      <Container.BackDrop onClick={() => setToggle(null)}></Container.BackDrop>
      <Form
        className="create_edit"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopProg}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 13,
          borderRadius: "15px",
        }}
      >
        <Form.Title style={{ fontSize: "20px" }}>
          {index === null ? "Create Product" : `Edit Prodcut`}
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
          <FileUpload.Input>
            <FileUpload.Show />
          </FileUpload.Input>
        </FileUpload>
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
        <Form.Item style={{ justifyContent: "flex-start" }}>
          <Form.Submit>Submit</Form.Submit>
          <Form.Button onClick={() => setToggle(null)}>Cancel</Form.Button>
        </Form.Item>
      </Form>
    </>
  );
}

function Remove({ index, product, setProducts, setRemove }) {
  const handleRemove = () => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
    setRemove(null);
  };
  return (
    <>
      <Container.BackDrop onClick={(e) => setRemove(null)}></Container.BackDrop>
      <Container.MiddleInner
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 13,
          borderRadius: "15px",
          backgroundColor: "white",
          padding: "20px",
          gap: "15px",
        }}
      >
        <label>{`Are you sure to Remove ${product.title}?`}</label>
        <Container.Flex style={{ gap: "10px" }}>
          <button onClick={handleRemove}>Yes</button>
          <button onClick={() => setRemove(null)}>No</button>
        </Container.Flex>
      </Container.MiddleInner>
    </>
  );
}
