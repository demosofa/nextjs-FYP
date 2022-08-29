import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { expireStorage, retryAxios } from "../../utils";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function MyShipping() {
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
  const { data, error } = useSWR(
    {
      url: `${LocalApi}/shipper`,
    },
    fetcher,
    {
      onError(err, key, config) {
        if (err.status === 300) return router.back();
        else if (err.status === 401) return router.push("/login");
        else return dispatch(addNotification({ message: err }));
      },
    }
  );
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
      <table className="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Order Id</th>
            <th>Status</th>
            <th>Address</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{order._id}</td>
              <td>{order.status}</td>
              <td>
                <a
                  target="_blank"
                  href={`https://maps.google.com/maps?q=${order.address}`}
                >
                  {order.address}
                </a>
              </td>
              <td>{order.customer.user.phoneNumber}</td>
              <td>
                <Link href={`/shipping/${order._id}`}>Manage Progress</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default dynamic(() => Promise.resolve(MyShipping), { ssr: false });
