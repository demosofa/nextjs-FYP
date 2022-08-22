import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pagination, Container, Search } from "../../components";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { Notification } from "../../Layout";
import { retryAxiosBackend } from "../../helpers";
import { retryAxios } from "../../utils";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

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
    router.query = query;
    router.replace({ pathname: router.pathname, query });
  }, [query]);

  const handleStatus = async (e, index) => {
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    try {
      await axios.patch(
        `${LocalApi}/product/${products[index]._id}`,
        {
          status: e.target.value,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setProducts((prev) => {
        const clone = JSON.parse(JSON.stringify(prev));
        clone[index].status = e.target.value;
        return clone;
      });
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };
  return (
    <div className="product-crud__container">
      <Head>
        <title>Manage Product</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Notification />
      <Container.Flex>
        <button onClick={() => router.push(`product/create`)}>Create</button>
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setQuery((prev) => ({ ...prev, search }))}
        />
      </Container.Flex>
      <div className="product-crud__table">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Status</th>
              <th>TimeStamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={product.images[0].url}
                      style={{ width: "100px", height: "80px" }}
                    ></img>
                  </td>
                  <td>{product.title}</td>
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
                    <p>Created at: {product.createdAt}</p>
                    <p>Updated at: {product.updatedAt}</p>
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
        totalPageCount={value.pageCounted}
        currentPage={query.page}
        setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
      >
        <Pagination.Arrow>
          <Pagination.Number />
        </Pagination.Arrow>
      </Pagination>
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
