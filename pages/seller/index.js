import axios from "axios";
import useSWRImmutable from "swr/immutable";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  Checkbox,
  Loading,
  Pagination,
  QRreader,
} from "../../frontend/components";
import { expireStorage, retryAxios } from "../../frontend/utils";
import { useState } from "react";
import dynamic from "next/dynamic";
import { addNotification } from "../../frontend/redux/reducer/notificationSlice";
import Head from "next/head";
import { currencyFormat } from "../../shared";
import { ThSortOrderBy } from "../../frontend/containers";

const LocalApi = process.env.NEXT_PUBLIC_API;

function SellerPage() {
  const [query, setQuery] = useState({ page: 1, sort: "total", orderby: -1 });
  const [viewOrderItem, setViewOrderItem] = useState();
  const [showScanner, setShowScanner] = useState(false);
  const [viewOrder, setViewOrder] = useState();
  const [checkOrder, setCheckOrder] = useState([]);
  const [scannedUrl, setScannedUrl] = useState();
  const fetcher = async (config) => {
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    const response = await axios({
      ...config,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, error, mutate } = useSWRImmutable(
    { url: `${LocalApi}/seller`, params: query },
    fetcher,
    {
      onError(err, key, config) {
        if (err?.response?.status === 403) router.back();
        else if (err?.response?.status === 401) router.push("/login");
        else dispatch(addNotification({ message: err.message, type: "error" }));
      },
    }
  );

  const handleScan = async (scanData) => {
    if (scanData) {
      try {
        const result = await fetcher({
          url: `${LocalApi}/seller/${scanData}`,
        });
        setScannedUrl(scanData);
        setViewOrder(result);
        setShowScanner(false);
      } catch (error) {
        setShowScanner(false);
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    }
  };

  const handleSubmit = () => {
    mutate(async (data) => {
      try {
        if (checkOrder.length === viewOrder.orderItems.length) {
          await fetcher({
            url: `${LocalApi}/seller/${scannedUrl}`,
            method: "patch",
          });
          setViewOrder(null);
        } else throw new Error("You are missing checked items");
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    });
  };

  if (!data || error)
    return (
      <Loading
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%)`,
        }}
      />
    );
  return (
    <div className="flex flex-col gap-6 px-24 sm:p-4 md:px-10">
      <Head>
        <title>Seller page</title>
        <meta name="description" content="Seller page" />
      </Head>
      <button
        className="main_btn"
        onClick={() => {
          setShowScanner(true);
          setViewOrder(null);
        }}
      >
        Get Shipper order information
      </button>
      <div>
        <div className="manage_table">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Id</th>
                <ThSortOrderBy query={query} setQuery={setQuery} target="total">
                  total
                </ThSortOrderBy>
                <ThSortOrderBy
                  query={query}
                  setQuery={setQuery}
                  target="validatedAt"
                >
                  Validated At
                </ThSortOrderBy>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.lstValidated.length ? (
                data.lstValidated.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order._id}</td>
                    <td>{currencyFormat(order.total)}</td>
                    <td>
                      {new Date(order.validatedAt).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </td>
                    <td>
                      <button
                        onClick={() => setViewOrderItem(order.orderItems)}
                      >
                        View List item
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <p className="text-center">
                      Currently, seller has yet validated any shipper order
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        totalPageCount={data.pageCounted}
        currentPage={query.page}
        setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
      >
        <Pagination.Arrow>
          <Pagination.Number />
        </Pagination.Arrow>
      </Pagination>

      {viewOrderItem && (
        <>
          <div className="backdrop" onClick={() => setViewOrderItem(null)} />
          <div className="form_center">
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Options</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {viewOrderItem.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <label>No.</label>
                      {index + 1}
                    </td>
                    <td>
                      <label>Image</label>
                      <img src={item.image} alt="order-item" />
                    </td>
                    <td>
                      <label>Title</label>
                      <p className="line-clamp-1 hover:line-clamp-none">
                        {item.title}
                      </p>
                    </td>
                    <td>
                      <label>Options</label>
                      <p className="line-clamp-1 hover:line-clamp-none">
                        {item.options.join(", ")}
                      </p>
                    </td>
                    <td>
                      <label>Quantity</label>
                      {item.quantity}
                    </td>
                    <td>
                      <label>Total</label>
                      {currencyFormat(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showScanner && (
        <>
          <div className="backdrop" onClick={() => setShowScanner(false)} />
          <QRreader
            onScanSuccess={handleScan}
            className="form_center w-full max-w-lg !p-0 sm:max-w-none"
          />
        </>
      )}
      {viewOrder && (
        <Checkbox
          name="check_item"
          setChecked={(value) => setCheckOrder(value)}
        >
          <table className="table">
            <thead>
              <tr>
                <th>Check</th>
                <th>No.</th>
                <th>Id</th>
                <th>Image</th>
                <th>Product Title</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {viewOrder.orderItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Checkbox.Item value={item._id} />
                  </td>
                  <td>
                    <label>No.</label>
                    {index + 1}
                  </td>
                  <td>
                    <label>Id</label>
                    {item._id}
                  </td>
                  <td>
                    <label>Image</label>
                    <img src={item.image} alt="order-item" />
                  </td>
                  <td>
                    <label>Title</label>
                    <p className="line-clamp-1 hover:line-clamp-none">
                      {item.title}
                    </p>
                  </td>
                  <td>
                    <label>Quantity</label>
                    {item.quantity}
                  </td>
                  <td>
                    <label>Price</label>
                    {currencyFormat(item.price)}
                  </td>
                  <td>
                    <label>Total</label>
                    {currencyFormat(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="main_btn mt-2" onClick={handleSubmit}>
            Validate
          </button>
        </Checkbox>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(SellerPage), { ssr: false });
