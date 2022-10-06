import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { expireStorage, retryAxios } from "../../utils";
import { Loading, Pagination } from "../../components";
import { useState } from "react";
import Head from "next/head";

const LocalApi = process.env.NEXT_PUBLIC_API;

function MyShipping() {
  const [viewOrder, setViewOrder] = useState(null);
  const [query, setQuery] = useState({ page: 1, sort: "status", filter: "" });
  const [showQR, setShowQR] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
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
  const { data, error } = useSWR(
    {
      url: `${LocalApi}/shipper?page=${query.page}&sort=${query.sort}&filter=${query.filter}`,
    },
    fetcher,
    {
      onError(err, key, config) {
        if (err.status === 300) return router.back();
        else if (err.status === 401) return router.push("/login");
        else
          return dispatch(
            addNotification({ message: err.message, type: "error" })
          );
      },
    }
  );

  const handleShowQR = async (orderId) => {
    try {
      const linkQR = await fetcher({
        url: `${LocalApi}/order/${orderId}`,
        method: "put",
      });
      setShowQR(linkQR);
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

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
          {data.lstShipping.length ? (
            data.lstShipping.map((order, index) => (
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
              <td colSpan="8" className="text-center">
                Go to this <Link href="/">page</Link> and accept orders first
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        className="mt-8"
        totalPageCount={data.pageCounted}
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

export default dynamic(() => Promise.resolve(MyShipping), { ssr: false });
