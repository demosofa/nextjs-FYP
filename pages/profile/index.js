import { withAuth } from "../../helpers";
import axios from "axios";
import Link from "next/link";
import styles from "../../styles/Home.module.scss";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export const getServerSideProps = withAuth(async ({ req }, role) => {
  let data = null;
  try {
    const response = await axios.get(`${LocalApi}/profile`, {
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

export default function MyProfile({ data }) {
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
              <th>Time</th>
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
