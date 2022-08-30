import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loading } from "../../components";
import { useAuthLoad } from "../../hooks";
import styles from "../../styles/Home.module.scss";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function MyProfile() {
  const router = useRouter();
  const [data, setData] = useState();
  const { loading, isLoggined, isAuthorized } = useAuthLoad({
    async cb(axiosInstance) {
      const res = await axiosInstance({
        url: `${LocalApi}/profile`,
      });
      setData(res.data);
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
  return (
    <div className={styles.flex} style={{ flexDirection: "column" }}>
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
      <div className={styles.card} style={{ maxWidth: "100%" }}>
        <table className="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Id</th>
              <th>Status</th>
              <th>Order Time</th>
              <th>Shipper</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(MyProfile), { ssr: false });
