import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pagination, Container, Search } from "../../../components";
import { retryAxios } from "../../../utils";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function ProductCRUD({ value }) {
  const [products, setProducts] = useState([
    {
      id: "",
      thumbnail: [],
      title: "T-shirt",
      status: "active",
      price: 2000,
      quantity: 40,
    },
  ]);
  const [remove, setRemove] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    async function fireAxios() {
      try {
        retryAxios(axios);
        const response = await axios.get(`${LocalApi}/productcrud`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("accessToken")
            )}`,
          },
        });
        const value = await response.data;
      } catch (error) {
        console.log(error);
      }
    }
    fireAxios();
  }, []);

  const handleStatus = async (e, index) => {
    setProducts((prev) => {
      let target = prev.concat();
      target[index].status = e.target.value;
      return target;
    });
    await axios.patch(`${LocalApi}/cart/${products[index].id}`, {
      status: e.target.value,
    });
  };

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
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Status</th>
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
                  <td>{product.thumbnail}</td>
                  <td>{product.title}</td>
                  <td>
                    <select
                      value={product.status}
                      onChange={(e) => handleStatus(e, index)}
                    >
                      <option value="active">active</option>
                      <option value="non-active">non-active</option>
                      <option value="out">out</option>
                    </select>
                  </td>
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
