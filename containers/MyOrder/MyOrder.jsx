import axios from "axios";
import { useDispatch } from "react-redux";
import { expireStorage, retryAxios } from "../../utils";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Select from "react-select";
import { Form, Loading } from "../../components";
import { currencyFormat } from "../../shared";
import { ItemsFromOrder } from "../";

const LocalApi = process.env.NEXT_PUBLIC_API;

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
    { url: `${LocalApi}/profile/order?status=shipping` },
    fetcher,
    {
      onError(err, key, config) {
        if (err.status === 300) router.back();
        else if (err.status === 401) router.push("/login");
        else dispatch(addNotification({ message: err.message, type: "error" }));
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
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    }, false);
  };

  const handleFilter = ({ value }) => {
    mutate(async (data) => {
      try {
        data = await fetcher({
          url: `${LocalApi}/profile/order`,
          params: { status: value },
        });
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    }, false);
  };

  return (
    <div className="w-full">
      <Select
        className="max-w-[120px]"
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
      <div className="manage_table relative min-h-max w-full overflow-x-auto">
        {!data || error ? (
          <Loading
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%)`,
            }}
          />
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
                    <td>{currencyFormat(order.total)}</td>
                    <td>{order.shipper?.username}</td>
                    <td>
                      <button onClick={() => setViewOrder(order.orderItems)}>
                        View order items
                      </button>
                      {order.status === "pending" && (
                        <button onClick={() => setDisplayCancel(order._id)}>
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
              <Form.Title>Are you sure to cancel {displayCancel}</Form.Title>
              <Form.Item>
                <Form.Button onClick={() => handleCancelOrder(displayCancel)}>
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
          <ItemsFromOrder viewOrder={viewOrder} setViewOrder={setViewOrder} />
        )}
      </div>
    </div>
  );
}
