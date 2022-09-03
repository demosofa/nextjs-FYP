import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loading } from "../../components";
import { useAuthLoad } from "../../hooks";
import { Role } from "../../shared";
import Head from "next/head";
import { MyOrder } from "../../containers";

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
    roles: [Role.guest, Role.admin, Role.shipper],
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
    <div className="flex flex-col items-center gap-10">
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

export default dynamic(() => Promise.resolve(MyProfile), { ssr: false });
