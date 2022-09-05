import axios from "axios";
import { useDispatch } from "react-redux";
import { expireStorage, retryAxios } from "../../utils";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Form, Loading } from "../../components";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function MyOrder() {
  const [displayCancel, setDisplayCancel] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
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
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, error, mutate } = useSWR(
    { url: `${LocalApi}/profile/order` },
    fetcher,
    {
      onError(err, key, config) {
        if (err.status === 300) return router.back();
        else if (err.status === 401) return router.push("/login");
        else return dispatch(addNotification({ message: err.message }));
      },
    }
  );

  const handleCancelOrder = async (orderId) => {
    mutate(async (data) => {
      retryAxios(axios);
      const accessToken = expireStorage.getItem("accessToken");
      try {
        await axios.delete(`${LocalApi}/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDisplayCancel(null);
        data = data.filter((item) => item._id !== orderId);
        return data;
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
        return data;
      }
    });
  };

  return (
    <div
      className="card manage_table relative w-full"
      style={{ maxWidth: "none" }}
    >
      {!data || error ? (
        <Loading
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%)`,
          }}
        ></Loading>
      ) : (
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Id</th>
              <th>Status</th>
              <th>Order Time</th>
              <th>Cost</th>
              <th>Shipper</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order._id}</td>
                <td>{order.status}</td>
                <td>{order.createdAt}</td>
                <td>${order.total}</td>
                <td>{order.shipper?.username}</td>
                <td>
                  <button onClick={() => setViewOrder(order.orderItems)}>
                    View order items
                  </button>
                  {order.status === "pending" && (
                    <button onClick={() => setDisplayCancel(order)}>
                      Cancel Order
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {displayCancel && (
        <>
          <div
            className="backdrop"
            onClick={() => setDisplayCancel(null)}
          ></div>
          <Form className="form_center">
            <Form.Title>Are you sure to cancel {displayCancel._id}</Form.Title>
            <Form.Item>
              <Form.Button onClick={() => handleCancelOrder(displayCancel._id)}>
                YES
              </Form.Button>
              <Form.Button onClick={() => setDisplayCancel(null)}>
                NO
              </Form.Button>
            </Form.Item>
          </Form>
        </>
      )}
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
                    <td>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
