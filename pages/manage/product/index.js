import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { Pagination, Container, Search } from "../../../components";

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
  const [remove, setRemove] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  return (
    <div className="product-crud__container">
      <Container.Flex>
        <button onClick={() => router.push(`product/create`)}>Create</button>
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
                    <button
                      onClick={() => router.push(`product/${product.id}`)}
                    >
                      Edit
                    </button>
                    <button onClick={() => setRemove(index)}>Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
