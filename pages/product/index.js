import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pagination, Search, Loading } from "../../components";
import { expireStorage, retryAxios } from "../../utils";
import { useAuthLoad } from "../../hooks";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { Role } from "../../shared";
import Image from "next/image";

const LocalApi = process.env.NEXT_PUBLIC_API;

function ProductCRUD() {
  const [remove, setRemove] = useState(null);
  const [query, setQuery] = useState({
    search: "",
    filter: "",
    sort: "title",
    page: 1,
  });
  const [search, setSearch] = useState(query.search);
  const [products, setProducts] = useState([]);
  const [totalPageCount, setTotalPageCount] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, isLoggined, isAuthorized } = useAuthLoad({
    async cb(axiosInstance) {
      const res = await axiosInstance({
        url: `${LocalApi}/product`,
        params: query,
      });
      setProducts(res.data.products);
      setTotalPageCount(res.data.pageCounted);
      return;
    },
    roles: [Role.admin],
    deps: [query],
  });

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
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  useEffect(() => {
    if (!loading && !isLoggined && !isAuthorized) router.push("/login");
    else if (!loading && !isAuthorized) router.back();
  }, [loading, isLoggined, isAuthorized]);

  const isLoadingInitialData = loading || !isLoggined || !isAuthorized;

  return (
    <div className="product-crud__container">
      <Head>
        <title>Manage Product</title>
      </Head>
      <div className="flex flex-wrap gap-4">
        <button
          className="main_btn"
          onClick={() => router.push(`product/create`)}
        >
          Create
        </button>
        <Search
          className="!ml-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setQuery((prev) => ({ ...prev, search }))}
        />
        <Select
          defaultValue={{ value: "", label: "All" }}
          onChange={({ value }) =>
            setQuery((prev) => ({ ...prev, filter: value }))
          }
          options={[
            { value: "", label: "All" },
            { value: "active", label: "Active" },
            { value: "non-active", label: "Non Active" },
            { value: "out", label: "Out of stock" },
          ]}
        />
      </div>
      {isLoadingInitialData ? (
        <Loading.Dots />
      ) : (
        <>
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
                          <Image
                            className="rounded-lg"
                            alt="product"
                            src={product.images[0].url}
                            width="100px"
                            height="90px"
                          />
                        </td>
                        <td className="group">
                          <p className="line-clamp-1 group-hover:line-clamp-none">
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
                            {new Date(product.createdAt).toLocaleString(
                              "en-US",
                              {
                                timeZone: "Asia/Ho_Chi_Minh",
                              }
                            )}
                          </p>
                          <p>
                            Updated at:{" "}
                            {new Date(product.updatedAt).toLocaleString(
                              "en-US",
                              {
                                timeZone: "Asia/Ho_Chi_Minh",
                              }
                            )}
                          </p>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="rounded-lg border-2 border-green-700 px-4 py-2 text-green-700 duration-300 hover:bg-green-700 hover:text-green-100"
                              onClick={() =>
                                router.push(`/overview/${product._id}`)
                              }
                            >
                              Preview
                            </button>
                            <button
                              className="rounded-lg border-2 border-blue-500 px-4 py-2 text-blue-500 duration-300 hover:bg-blue-600 hover:text-blue-100"
                              onClick={() =>
                                router.push(`product/update/${product._id}`)
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="rounded-lg border-2 border-red-600 px-4 py-2 text-red-600 duration-300 hover:bg-red-600 hover:text-red-100"
                              onClick={() => setRemove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6">
                      <p className="text-center">Please add new products</p>
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
          {totalPageCount ? (
            <Pagination
              totalPageCount={totalPageCount}
              currentPage={query.page}
              setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
            >
              <Pagination.Arrow>
                <Pagination.Number />
              </Pagination.Arrow>
            </Pagination>
          ) : null}
        </>
      )}
    </div>
  );
}

function Remove({ index, product, setProducts, setRemove }) {
  const handleRemove = async () => {
    const accessToken = expireStorage.getItem("accessToken");
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
      <div className="backdrop" onClick={(e) => setRemove(null)} />
      <div className="form_center">
        <label>{`Are you sure to Remove ${product.title}?`}</label>
        <div className="flex gap-3">
          <button onClick={handleRemove}>Yes</button>
          <button onClick={() => setRemove(null)}>No</button>
        </div>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(ProductCRUD), { ssr: false });
