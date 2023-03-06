import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import {
  Checkbox,
  Loading,
  Pagination,
  QRreader,
} from "../../frontend/components";
import { ThSortOrderBy } from "../../frontend/containers";
import { fetcher } from "../../frontend/contexts/SWRContext";
import { addNotification } from "../../frontend/redux/reducer/notificationSlice";
import { convertTime, currencyFormat } from "../../shared";

const ItemsFromOrder = dynamic(
  () => import("../../frontend/containers/ItemsFromOrder/ItemsFromOrder"),
  { loading: () => <Loading.Dots /> }
);
const LocalApi = process.env.NEXT_PUBLIC_API;

export default function SellerPage() {
  const [query, setQuery] = useState({ page: 1, sort: "total", orderby: -1 });
  const [viewOrderItem, setViewOrderItem] = useState();
  const [showScanner, setShowScanner] = useState(false);
  const [viewOrder, setViewOrder] = useState();
  const [checkOrder, setCheckOrder] = useState([]);
  const [scannedUrl, setScannedUrl] = useState();
  const dispatch = useDispatch();
  const { isLoading, data, mutate } = useSWR(
    { url: `${LocalApi}/seller`, params: query },
    {
      refreshInterval: convertTime("5s").milisecond,
      dedupingInterval: convertTime("5s").milisecond,
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

  if (isLoading)
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
                <ThSortOrderBy
                  query={query}
                  setQuery={setQuery}
                  target="status"
                >
                  Status
                </ThSortOrderBy>
                <ThSortOrderBy query={query} setQuery={setQuery} target="total">
                  Total
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
                    <td>{order.status}</td>
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
                  <td colSpan="6">
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
        <ItemsFromOrder
          viewOrder={viewOrderItem}
          setViewOrder={setViewOrderItem}
        />
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
      {viewOrder ? (
        <>
          <div className="backdrop" onClick={() => setViewOrder(null)} />
          <div className="form_center">
            <label>Check all items to validate shipper order</label>
            <Checkbox
              className="max-h-full overflow-auto"
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
            </Checkbox>
            <button className="main_btn mt-2" onClick={handleSubmit}>
              Validate
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
