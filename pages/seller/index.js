import axios from "axios";
import useSWRImmutable from "swr/immutable";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Loading } from "../../components";
import { expireStorage, retryAxios } from "../../utils";
import { useState } from "react";
import QrScanner from "react-qr-scanner";
import dynamic from "next/dynamic";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function SellerPage() {
  const [viewOrder, setViewOrder] = useState();
  const [showScanner, setShowScanner] = useState(false);
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
        else return dispatch(addNotification({ message: err.message }));
      },
    }
  );

  const handleScan = async (scanData) => {
    if (scanData && scanData !== "") {
      try {
        const result = await fetcher({
          url: `${LocalApi}/seller/${scanData}`,
        });
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
      }
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
    <div>
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
          {data.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{order._id}</td>
              <td>{order.total}</td>
              <td>{order.validatedAt}</td>
              <td>
                <button onClick={() => setViewOrder(order.orderItems)}>
                  View List item
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {viewOrder && (
        <>
          <div className="backdrop" onClick={() => setViewOrder(null)}></div>
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
                {viewOrder.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <img src={item.image} alt="order-item"></img>
                    </td>
                    <td>{item.title}</td>
                    <td>{item.options.join(", ")}</td>
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
        <QrScanner
          facingMode="front"
          delay={500}
          onError={(err) => dispatch(addNotification({ message: err }))}
          onScan={handleScan}
          className="h-80 w-80"
        />
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(SellerPage), { ssr: false });
