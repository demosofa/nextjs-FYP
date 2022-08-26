import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Checkbox, Form } from "../../components";
import { withAuth } from "../../helpers";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { retryAxios } from "../../utils";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export const getServerSideProps = withAuth(async ({ req }, role) => {
  let orders = null;
  try {
    const response = await axios.get(`${LocalApi}/order`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    orders = response.data;
  } catch (error) {
    console.log(error.message);
  }
  return {
    props: {
      orders,
      role,
    },
  };
});

export default function Shipper({ orders }) {
  const [checkOrder, setCheckOrder] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    retryAxios(axios);
    try {
      await axios.put(`${LocalApi}/shipper`, { acceptedOrders: checkOrder });
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
