import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { withAuth } from "../../helpers";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { Checkbox, Form, Loading } from "../../components";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { retryAxios } from "../../utils";
import { convertTime } from "../../shared";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export const getServerSideProps = withAuth(async ({ req }, role) => {
  let lstOrder = null;
  try {
    const response = await axios.get(`${LocalApi}/order`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    lstOrder = response.data;
  } catch (error) {
    console.log(error.message);
  }
  return {
    props: {
      lstOrder,
      role,
    },
  };
});

export default function Shipper({ lstOrder }) {
  const [checkOrder, setCheckOrder] = useState([]);

  const fetcher = async (config) => {
    retryAxios(axios);
    const response = await axios(config);
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
      fallbackData: lstOrder,
      refreshInterval: convertTime("5s").milisecond,
      dedupingInterval: convertTime("5s").milisecond,
      onError(err, key, config) {
        if (err.response.status === 300) return router.back();
        else if (err.response.status === 401) return router.push("/login");
        else return dispatch(addNotification({ message: err.message }));
      },
    }
  );

  const { mutate } = useSWRImmutable({ url: `${LocalApi}/shipper` }, fetcher);

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
    mutate(async (data) => {
      try {
        if (data)
          await fetcher({
            url: `${LocalApi}/shipper`,
            method: "put",
            data: { acceptedOrders: checkOrder },
          });
        dispatch(addNotification({ message: "Success receive orders" }));
        router.push("/");
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
      }
      return data;
    }, false);
  };

  return (
    <div>
      <Head>
        <title>List pending order</title>
        <meta name="description" content="List pending order" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Checkbox setChecked={(value) => setCheckOrder(value)}>
        <table className="table">
          <thead>
            <tr>
              <th>Check</th>
              <th>Order Id</th>
              <th>Price</th>
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
                <td>${order.total}</td>
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
