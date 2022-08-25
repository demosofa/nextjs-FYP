import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Checkbox, Form, Loading } from "../../components";
import { useAuthLoad } from "../../hooks";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { expireStorage, retryAxios } from "../../utils";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function Shipper() {
  const [orders, setOrders] = useState([]);
  const [checkOrder, setCheckOrder] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, isLoggined, isAuthorized } = useAuthLoad({
    async cb(axiosInstance) {
      const res = await axiosInstance({
        url: `${LocalApi}/order`,
      });
      setOrders(res.data);
    },
    roles: ["guest"],
  });
  useEffect(() => {
    if (!loading && !isLoggined && !isAuthorized) router.push("/login");
    else if (!loading && !isAuthorized) router.back();
  }, [loading, isLoggined, isAuthorized]);

  if (loading || !isLoggined || !isAuthorized)
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
            <th>Check</th>
            <th>Order Id</th>
            <th>Status</th>
            <th>Address</th>
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
