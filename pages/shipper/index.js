import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { Checkbox, Form, Loading } from "../../components";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { convertTime, expireStorage, retryAxios } from "../../utils";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function Shipper() {
  const [checkOrder, setCheckOrder] = useState([]);

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
  const { data: orders, error } = useSWR(
    {
      url: `${LocalApi}/order`,
    },
    fetcher,
    {
      refreshInterval: convertTime("5s").milisecond,
      dedupingInterval: convertTime("5s").milisecond,
      onError(err, key, config) {
        if (err.status === 300) return router.back();
        else if (err.status === 401) return router.push("/login");
        else return dispatch(addNotification({ message: err }));
      },
    }
  );

  if (!orders || error)
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

  const handleSubmit = async () => {
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    try {
      await axios.put(
        `${LocalApi}/shipper`,
        { acceptedOrders: checkOrder },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

  return (
    <div>
      <Checkbox setChecked={(value) => setCheckOrder(value)}>
        <table className="table">
          <thead>
            <tr>
              <th>Check</th>
              <th>Order Id</th>
              <th>Status</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <Checkbox.Item value={order._id}></Checkbox.Item>
                </td>
                <td>{order._id}</td>
                <td>{order.status}</td>
                <td>
                  <Form.Link
                    target="_blank"
                    href={`https://maps.google.com/maps?q=${order.address}`}
                  >
                    {order.address}
                  </Form.Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Checkbox>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Shipper), { ssr: false });
