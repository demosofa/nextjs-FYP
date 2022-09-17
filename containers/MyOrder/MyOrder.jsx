import axios from "axios";
import { useDispatch } from "react-redux";
import { retryAxios } from "../../utils";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Select from "react-select";
import { Form, Loading } from "../../components";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function MyOrder() {
  const [displayCancel, setDisplayCancel] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const fetcher = async (config) => {
    retryAxios(axios);
    const response = await axios(config);
    return response.data;
  };
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, error, mutate } = useSWR(
    { url: `${LocalApi}/profile/order?status=shipping` },
    fetcher,
    {
      onError(err, key, config) {
        if (err.response.status === 300) return router.back();
        else if (err.response.status === 401) return router.push("/login");
        else return dispatch(addNotification({ message: err.message }));
      },
    }
  );

  const handleCancelOrder = async (orderId) => {
    mutate(async (data) => {
      try {
        await fetcher({
          method: "delete",
          url: `${LocalApi}/order/${orderId}`,
        });
        setDisplayCancel(null);
        const index = data.findIndex((item) => item._id === orderId);
        data[index].status = "cancel";
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
        return data;
      }
    }, false);
  };

  const handleFilter = ({ value }) => {
    mutate(async (data) => {
      try {
        const data = await fetcher({
          url: `${LocalApi}/profile/order`,
          params: { status: value },
        });
        return data;
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
        return data;
      }
    }, false);
  };

  return (
    <div>
      <Select
        defaultValue={{ value: "shipping", label: "Shipping" }}
        onChange={handleFilter}
        options={[
          { value: "pending", label: "Pending" },
          { value: "progress", label: "Progress" },
          { value: "shipping", label: "Shipping" },
          { value: "arrived", label: "Arrived" },
          { value: "validated", label: "Validated" },
          { value: "cancel", label: "Cancel" },
        ]}
      />
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
              {data.length ? (
                data.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order._id}</td>
                    <td>{order.status}</td>
                    <td>
                      {new Date(order.createdAt).toLocaleString("en-US", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Currently there is any orders that meet this filter
                  </td>
                </tr>
              )}
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
              <Form.Title>
                Are you sure to cancel {displayCancel._id}
              </Form.Title>
              <Form.Item>
                <Form.Button
                  onClick={() => handleCancelOrder(displayCancel._id)}
                >
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
                      <td>
                        <p className="text-xs line-clamp-1 hover:line-clamp-none">
                          {item.title}
                        </p>
                      </td>
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
      </div>
    </div>
  );
}
