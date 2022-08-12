import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pagination, Container, Search, Loading } from "../../components";
import { retryAxios } from "../../utils";
import { useAuthLoad } from "../../hooks";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { Notification } from "../../Layout";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function ProductCRUD() {
  const [remove, setRemove] = useState(null);
  const [params, setParams] = useState({
    search: "",
    filter: "",
    sort: "title",
    page: 1,
  });
  const [search, setSearch] = useState(params.search);
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    loading,
    isLoggined,
    isAuthorized,
    data: products,
    setData: setProducts,
  } = useAuthLoad({
    config: {
      url: `${LocalApi}/product`,
      params,
    },
    roles: ["guest"],
    deps: [params],
  });

  const handleStatus = async (e, index) => {
    retryAxios(axios);
    try {
      await axios.patch(`${LocalApi}/product/${products[index]._id}`, {
        status: e.target.value,
      });
      setProducts((prev) => {
        const copy = JSON.parse(JSON.stringify(prev));
        copy[index].status = e.target.value;
        return copy;
      });
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  useEffect(() => {
    if (!loading && !isLoggined && !isAuthorized) router.push("/login");
    else if (!loading && !isAuthorized) router.back();
  }, [loading, isLoggined, isAuthorized]);

  if (loading || !isLoggined || !isAuthorized)
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
          onClick={() => setParams((prev) => ({ ...prev, search }))}
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
            {products.map((product, index) => {
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
        totalPageCount={10}
        currentPage={params.page}
        setCurrentPage={(page) => setParams((prev) => ({ ...prev, page }))}
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
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    retryAxios(axios);
    await axios.delete(`${LocalApi}/product/${product._id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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

export default dynamic(() => Promise.resolve(ProductCRUD), { ssr: false });
