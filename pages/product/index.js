import axios from "axios";
import Head from "next/head";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pagination, Container, Search } from "../../components";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { Notification } from "../../layouts";
import { retryAxiosBackend } from "../../helpers";
import { retryAxios } from "../../utils";

const LocalApi = process.env.NEXT_PUBLIC_API;

export async function getServerSideProps({ req, res, query }) {
  let value = null;
  const axiosInstance = axios.create({
    headers: {
      Cookie: req.headers.cookie,
    },
  });
  retryAxiosBackend(axiosInstance, req, res);
  try {
    const response = await axiosInstance.get(`${LocalApi}/product`, {
      params: query,
    });
    value = response.data;
  } catch (error) {
    console.log("!!! retry axios please");
  }
  return {
    props: {
      value,
    },
  };
}

export default function ProductCRUD({ value }) {
  const [products, setProducts] = useState(value.products);
  const [remove, setRemove] = useState(null);
  const [query, setQuery] = useState({
    search: "",
    filter: "",
    sort: "title",
    page: 1,
  });
  const [search, setSearch] = useState(query.search);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    router.replace({ pathname: router.pathname, query });
  }, [query]);

  useEffect(() => setProducts(value.products), [value]);

  const handleStatus = async (e, index) => {
    retryAxios(axios);
    try {
      await axios.patch(`${LocalApi}/product/${products[index]._id}`, {
        status: e.target.value,
      });
      setProducts((prev) => {
        const clone = JSON.parse(JSON.stringify(prev));
        clone[index].status = e.target.value;
        return clone;
      });
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };
  return (
    <div className="product-crud__container">
      <Head>
        <title>Manage Product</title>
      </Head>
      <Notification />
      <Container.Flex>
        <button onClick={() => router.push(`product/create`)}>Create</button>
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setQuery((prev) => ({ ...prev, search }))}
        />
        <Select
          onChange={({ value }) =>
            setQuery((prev) => ({ ...prev, filter: value }))
          }
          options={[
            { value: "active", label: "Active" },
            { value: "non-active", label: "Non Active" },
            { value: "out", label: "Out of stock" },
          ]}
          className="ml-3"
        />
      </Container.Flex>
      <div className="manage_table">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Thumbnail</th>
              <th style={{ width: "20%" }}>Title</th>
              <th>Status</th>
              <th>TimeStamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product, index) => {
                return (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        alt="product"
                        src={product.images[0].url}
                        style={{ width: "100px", height: "80px" }}
                      ></img>
                    </td>
                    <td>
                      <p className="line-clamp-1 hover:line-clamp-none">
                        {product.title}
                      </p>
                    </td>
                    <td>
                      <select
                        defaultValue={product.status}
                        onChange={(e) => handleStatus(e, index)}
                      >
                        <option value="active">active</option>
                        <option value="non-active">non-active</option>
                        <option value="out">out</option>
                      </select>
                    </td>
                    <td>
                      <p>
                        Created at:{" "}
                        {new Date(product.createdAt).toLocaleString("en-US", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}
                      </p>
                      <p>
                        Updated at:{" "}
                        {new Date(product.updatedAt).toLocaleString("en-US", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}
                      </p>
                    </td>
                    <td>
                      <button
                        onClick={() => router.push(`/overview/${product._id}`)}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() =>
                          router.push(`product/update/${product._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button onClick={() => setRemove(index)}>Remove</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Please add new products
                </td>
              </tr>
            )}
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
      {value.pageCounted ? (
        <Pagination
          totalPageCount={value.pageCounted}
          currentPage={query.page}
          setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
        >
          <Pagination.Arrow>
            <Pagination.Number />
          </Pagination.Arrow>
        </Pagination>
      ) : null}
    </div>
  );
}

function Remove({ index, product, setProducts, setRemove }) {
  const handleRemove = async () => {
    retryAxios(axios);
    await axios.delete(`${LocalApi}/product/${product._id}`);
    setProducts((prev) => prev.filter((_, i) => i !== index));
    setRemove(null);
  };
  return (
    <>
      <Container.BackDrop onClick={(e) => setRemove(null)}></Container.BackDrop>
      <Container.MiddleInner className="form_center">
        <label>{`Are you sure to Remove ${product.title}?`}</label>
        <Container.Flex style={{ gap: "10px" }}>
          <button onClick={handleRemove}>Yes</button>
          <button onClick={() => setRemove(null)}>No</button>
        </Container.Flex>
      </Container.MiddleInner>
    </>
  );
}
