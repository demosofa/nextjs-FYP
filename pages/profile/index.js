import { withAuth } from "../../helpers";
import axios from "axios";

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
    <div>
      <div className={styles.grid}>
        <div>{data.fullname}</div>
        <div className={styles.card}>
          <div>{data.dateOfBirth}</div>
          <div>{data.gender}</div>
          <div>{data.phoneNumber}</div>
          <div>{data.email}</div>
        </div>
      </div>
      <div className={styles.card}>
        {data.orders?.map((order) => (
          <div>{order._id}</div>
        ))}
      </div>
    </div>
  );
}
