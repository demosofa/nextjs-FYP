import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Loading } from "../../components";
import { useAuthLoad } from "../../hooks";
import { Role } from "../../shared";
import styles from "../../styles/Home.module.scss";
import { expireStorage, retryAxios } from "../../utils";
import { addNotification } from "../../redux/reducer/notificationSlice";
import Head from "next/head";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function MyProfile() {
  const [viewOrder, setViewOrder] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState();
  const { loading, isLoggined, isAuthorized } = useAuthLoad({
    async cb(axiosInstance) {
      const res = await axiosInstance({
        url: `${LocalApi}/profile`,
      });
      setData(res.data);
    },
    roles: [Role.guest, Role.admin, Role.shipper],
  });

  const handleCancelOrder = async (orderId) => {
    retryAxios(axios);
    const accessToken = expireStorage.getItem("accessToken");
    try {
      await axios.delete(`${LocalApi}/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData((prev) => {
        const clone = JSON.parse(JSON.stringify(prev));
        clone.orders = clone.orders.filter((item) => item._id !== orderId);
        return clone;
      });
    } catch (error) {
      dispatch(addNotification({ message: error.message }));
    }
  };

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
  return (
    <div className={styles.flex} style={{ flexDirection: "column" }}>
      <Head>
        <title>My Profile</title>
        <meta name="description" content="My Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.flex}>
        <dl className={styles.flex}>
          <dt>Full Name:</dt>
          <dd>{data._doc.fullname}</dd>
        </dl>
        <div className={styles.card}>
          <dl className={styles.flex}>
            <dt>Date of Birth:</dt>
            <dd>{data._doc.dateOfBirth}</dd>
          </dl>
          <dl className={styles.flex}>
            <dt>Gender:</dt>
            <dd>{data._doc.gender}</dd>
          </dl>
          <dl className={styles.flex}>
            <dt>Phone Number:</dt>
            <dd>{data._doc.phoneNumber}</dd>
          </dl>
          <dl className={styles.flex}>
            <dt>Email:</dt>
            <dd>{data._doc.email}</dd>
          </dl>
        </div>
        <Link href="/profile/edit">
          <a
            style={{
              borderRadius: "14px",
              backgroundColor: "#eaeaea",
              maxHeight: "50px",
              padding: "5px 8px",
            }}
          >
            Edit Profile
          </a>
        </Link>
      </div>
      <div
        className={`${styles.card} manage_table`}
        style={{ maxWidth: "100%" }}
      >
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Id</th>
              <th>Status</th>
              <th>Order Time</th>
              <th>Shipper</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.orders?.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order._id}</td>
                <td>{order.status}</td>
                <td>{order.createdAt}</td>
                <td>{order.shipper?.username}</td>
                <td>
                  <button onClick={() => setViewOrder(order.orderItems)}>
                    View order items
                  </button>
                  {order.status === "pending" && (
                    <button onClick={() => handleCancelOrder(order._id)}>
                      Cancel Order
                    </button>
                  )}
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
    </div>
  );
}

export default dynamic(() => Promise.resolve(MyProfile), { ssr: false });
