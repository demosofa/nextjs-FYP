import axios from "axios";
import useSWRImmutable from "swr/immutable";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Checkbox, Loading, Pagination, QRreader } from "../../components";
import { Widget } from "../../containers";
import { expireStorage, retryAxios } from "../../utils";
import { useState } from "react";
import dynamic from "next/dynamic";
import { addNotification } from "../../redux/reducer/notificationSlice";
import Head from "next/head";
import { currencyFormat } from "../../shared";
import { useMediaContext } from "../../contexts/MediaContext";

const LocalApi = process.env.NEXT_PUBLIC_API;

function SellerPage() {
  const [page, setPage] = useState(1);
  const [viewOrderItem, setViewOrderItem] = useState();
  const [showScanner, setShowScanner] = useState(false);
  const [viewOrder, setViewOrder] = useState();
  const [checkOrder, setCheckOrder] = useState([]);
  const [scannedUrl, setScannedUrl] = useState();
  const { device, Devices } = useMediaContext();
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
  const { data, error } = useSWRImmutable(
    { url: `${LocalApi}/seller?page=${page}` },
    fetcher,
    {
      onError(err, key, config) {
        if (err.status === 300) router.back();
        else if (err.status === 401) router.push("/login");
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
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    }
  };

  const handleSubmit = async () => {
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
        <link rel="icon" href="/favicon.ico" />
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
                <th>total</th>
                <th>Validated At</th>
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
                  <td colSpan="5" className="text-center">
                    Currently, seller has yet validated any shipper order
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* <Widget
          className="max-w-[200px]"
          url={`${LocalApi}/seller/income`}
          description="Compare to yester"
        >
          Sale Status
        </Widget> */}
      </div>

      <Pagination
        totalPageCount={data.pageCounted}
        currentPage={page}
        setCurrentPage={setPage}
      >
        <Pagination.Arrow>
          <Pagination.Number />
        </Pagination.Arrow>
      </Pagination>

      {viewOrderItem && (
        <>
          <div
            className="backdrop"
            onClick={() => setViewOrderItem(null)}
          ></div>
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
                    <td>{index + 1}</td>
                    <td>
                      <img src={item.image} alt="order-item" />
                    </td>
                    <td>
                      <p className="line-clamp-1 hover:line-clamp-none">
                        {item.title}
                      </p>
                    </td>
                    <td>
                      <p className="line-clamp-1 hover:line-clamp-none">
                        {item.options.join(", ")}
                      </p>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{currencyFormat(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showScanner && (
        <>
          <div className="backdrop" onClick={() => setShowScanner(false)}></div>
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
                  <td>{index + 1}</td>
                  <td>{item._id}</td>
                  <td>
                    <img src={item.image} alt="order-item" />
                  </td>
                  <td>
                    <p className="line-clamp-1 hover:line-clamp-none">
                      {item.title}
                    </p>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{currencyFormat(item.price)}</td>
                  <td>{currencyFormat(item.total)}</td>
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
