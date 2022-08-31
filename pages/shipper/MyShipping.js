import axios from "axios";
import Link from "next/link";
import { withAuth } from "../../helpers";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export const getServerSideProps = withAuth(async ({ req }, role) => {
  let initData = null;
  try {
    const response = await axios.get(`${LocalApi}/shipper`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    initData = response.data;
  } catch (error) {
    console.log(error.message);
  }
  return {
    props: {
      initData,
      role,
    },
  };
});

export default function MyShipping({ initData }) {
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {initData.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{order._id}</td>
              <td>{order.status}</td>
              <td>
                <a
                  target="_blank"
                  rel="noreferrer"
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
