import axios from "axios";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { retryAxios } from "../../utils";
import { Pagination } from "../../components";
import { useState } from "react";
import Head from "next/head";
import { withAuth } from "../../helpers";

const LocalApi = process.env.NEXT_PUBLIC_API;

export const getServerSideProps = withAuth(async ({ req }, role) => {
  let data = null;
  try {
    const response = await axios.get(`${LocalApi}/shipper`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    data = response.data;
  } catch (error) {
    console.log(error.message);
  }
  return {
    props: {
      data,
      role,
    },
  };
});

export default function MyShipping({ data }) {
  const [viewOrder, setViewOrder] = useState(null);
  const [query, setQuery] = useState({ page: 1, sort: "status", filter: "" });
  const [showQR, setShowQR] = useState(null);
  const dispatch = useDispatch();
  const handleShowQR = async (orderId) => {
    retryAxios(axios);
    try {
      const response = await axios.put(`${LocalApi}/order/${orderId}`);
      setShowQR(response.data);
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

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
            <th>Customer</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Total Value</th>
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
                <td>{order.customer.username}</td>
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
                  {order.status === "progress" && (
                    <button onClick={() => handleShowQR(order._id)}>
                      Show QR to seller
                    </button>
                  )}
                  <Link href={`/shipping/${order._id}`}>
                    <a className="flex items-center justify-center rounded-lg bg-amber-600 p-2">
                      Manage Progress
                    </a>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Go to this <Link href="/">page</Link> and accept orders first
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        totalPageCount={10}
        currentPage={query.page}
        setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
      >
        <Pagination.Arrow>
          <Pagination.Number />
        </Pagination.Arrow>
      </Pagination>
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
                      <p className="line-clamp-1 hover:line-clamp-none">
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
      {showQR && (
        <>
          <div className="backdrop" onClick={() => setShowQR(null)}></div>
          <div className="form_center">
            <img src={showQR} alt="QR code"></img>
          </div>
        </>
      )}
    </div>
  );
}
