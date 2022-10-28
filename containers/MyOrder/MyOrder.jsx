import axios from "axios";
import { useDispatch } from "react-redux";
import { expireStorage, retryAxios, tailwindStatus } from "../../utils";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Select from "react-select";
import { Form, Loading, Search } from "../../components";
import { currencyFormat, OrderStatus } from "../../shared";
import { ItemsFromOrder } from "../";
import Link from "next/link";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function MyOrder() {
  const [search, setSearch] = useState("");
  const [params, setParams] = useState({
    status: "",
    search: "",
  });
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
    {
      url: `${LocalApi}/profile/order`,
      params,
    },
    fetcher,
    {
      onError(err, key, config) {
        if (err?.response?.status === 403) router.back();
        else if (err?.response?.status === 401) router.push("/login");
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

  return (
    <div className="w-full">
      <div className="mb-3 flex justify-between">
        <Search
          className="!m-0 max-w-fit"
          style={{ width: "100%" }}
          placeholder="search shipper"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setParams((prev) => ({ ...prev, search }))}
        />
        <Select
          className="w-32"
          defaultValue={{ value: "", label: "all" }}
          onChange={({ value }) =>
            setParams((prev) => ({ ...prev, status: value }))
          }
          options={[
            { value: "", label: "all" },
            { value: OrderStatus.pending, label: "Pending" },
            { value: OrderStatus.progress, label: "Progress" },
            { value: OrderStatus.shipping, label: "Shipping" },
            { value: OrderStatus.arrived, label: "Arrived" },
            { value: OrderStatus.validated, label: "Validated" },
            { value: OrderStatus.paid, label: "Paid" },
            { value: OrderStatus.cancel, label: "Cancel" },
          ]}
        />
      </div>
      <div className="manage_table min-h-max w-full overflow-x-auto">
        {!data || error ? (
          <Loading.Spinner className="mx-auto" />
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
                    <td>
                      <Link href={`/shipping/${order._id}`}>
                        <a className={tailwindStatus(order.status)}>
                          {order.status}
                        </a>
                      </Link>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleString("en-US", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </td>
                    <td>{currencyFormat(order.total)}</td>
                    <td>{order.shipper?.username}</td>
                    <td>
                      <button
                        className="mr-5 whitespace-nowrap uppercase text-indigo-600 hover:text-indigo-900 focus:underline focus:outline-none"
                        onClick={() => setViewOrder(order.orderItems)}
                      >
                        View order items
                      </button>
                      {order.status === OrderStatus.pending && (
                        <button
                          className="whitespace-nowrap uppercase text-red-600 hover:text-red-900 focus:underline focus:outline-none"
                          onClick={() => setDisplayCancel(order._id)}
                        >
                          Cancel Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <p className="text-center">
                      Currently there is any orders that meet this filter
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {displayCancel && (
          <>
            <div className="backdrop" onClick={() => setDisplayCancel(null)} />
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
