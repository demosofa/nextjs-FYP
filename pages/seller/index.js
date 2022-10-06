import axios from "axios";
import useSWRImmutable from "swr/immutable";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Checkbox, Loading } from "../../components";
import { expireStorage, retryAxios } from "../../utils";
import { useState } from "react";
import QrScanner from "react-qr-scanner";
import dynamic from "next/dynamic";
import { addNotification } from "../../redux/reducer/notificationSlice";
import Head from "next/head";

const LocalApi = process.env.NEXT_PUBLIC_API;

function SellerPage() {
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
    { url: `${LocalApi}/seller` },
    fetcher,
    {
      onError(err, key, config) {
        if (err.status === 300) return router.back();
        else if (err.status === 401) return router.push("/login");
        else
          return dispatch(
            addNotification({ message: err.message, type: "error" })
          );
      },
    }
  );

  const handleScan = async (scanData) => {
    if (scanData && scanData !== "") {
      try {
        const result = await fetcher({
          url: `${LocalApi}/seller/${scanData.text}`,
        });
        // window.location.href = scanData.text;
        setScannedUrl(scanData.text);
        setViewOrder(result);
        setShowScanner(false);
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await fetcher({
        url: `${LocalApi}/seller/${scannedUrl}`,
        method: "patch",
      });
      setViewOrder(null);
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
      ></Loading>
    );
  return (
    <div className="manage_table">
      <Head>
        <title>Seller page</title>
        <meta name="description" content="Seller page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={() => setShowScanner(true)}>
        Get Shipper order information
      </button>
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
          {data.length ? (
            data.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order._id}</td>
                <td>${order.total}</td>
                <td>
                  {new Date(order.validatedAt).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </td>
                <td>
                  <button onClick={() => setViewOrderItem(order.orderItems)}>
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
                      <img src={item.image} alt="order-item"></img>
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
                    <td>${item.total}</td>
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
          <QrScanner
            facingMode="rear"
            delay={500}
            onError={(err) => dispatch(addNotification({ message: err }))}
            onScan={handleScan}
            className="form_center"
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
                    <img src={item.image} alt="order-item"></img>
                  </td>
                  <td>
                    <p className="line-clamp-1 hover:line-clamp-none">
                      {item.title}
                    </p>
                  </td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit}>Validate</button>
        </Checkbox>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(SellerPage), { ssr: false });
