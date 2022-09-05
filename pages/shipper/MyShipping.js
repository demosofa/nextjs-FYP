import axios from "axios";
import Link from "next/link";
import { withAuth } from "../../helpers";
import { useState } from "react";
import Head from "next/head";

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
  const [viewOrder, setViewOrder] = useState(null);
  return (
    <div className="manage_table">
      <Head>
        <title>My Shipping</title>
        <meta name="description" content="My Shipping" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Order Id</th>
            <th>Status</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Total Value</th>
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
              <td>${order.total}</td>
              <td className="flex flex-col items-center">
                <button onClick={() => setViewOrder(order.orderItems)}>
                  View List item
                </button>
                <Link href={`/shipping/${order._id}`}>
                  <a className="flex items-center justify-center rounded-lg bg-amber-600 p-2">
                    Manage Progress
                  </a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
