import { withAuth } from "../../helpers";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { MyOrder } from "../../containers";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export const getServerSideProps = withAuth(async ({ req }, role) => {
  let initData = null;
  try {
    const response = await axios.get(`${LocalApi}/profile`, {
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

export default function MyProfile({ initData: data }) {
  return (
    <div className="flex" style={{ flexDirection: "column" }}>
      <Head>
        <title>My Profile</title>
        <meta name="description" content="My Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex gap-8">
        <div className="card">
          <dl className="flex items-center justify-between">
            <dt>Full Name:</dt>
            <dd>{data.fullname}</dd>
          </dl>
          <dl className="flex items-center justify-between">
            <dt>Date of Birth:</dt>
            <dd>{data.dateOfBirth}</dd>
          </dl>
          <dl className="flex items-center justify-between">
            <dt>Gender:</dt>
            <dd>{data.gender}</dd>
          </dl>
          <dl className="flex items-center justify-between">
            <dt>Phone Number:</dt>
            <dd>{data.phoneNumber}</dd>
          </dl>
          <dl className="flex items-center justify-between">
            <dt>Email:</dt>
            <dd>{data.email}</dd>
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
      <MyOrder></MyOrder>
    </div>
  );
}
