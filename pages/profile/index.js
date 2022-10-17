import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loading, Slider } from "../../components";
import { useAuthLoad } from "../../hooks";
import { Role, dateFormat, currencyFormat } from "../../shared";
import Head from "next/head";
import { MyOrder, ProductSlider } from "../../containers";
import { useSelector } from "react-redux";
import { useMediaContext } from "../../contexts/MediaContext";
import styles from "../../styles/Home.module.scss";

const LocalApi = process.env.NEXT_PUBLIC_API;

function MyProfile() {
  const router = useRouter();
  const [data, setData] = useState();
  const recentlyViewed = useSelector((state) => {
    // let size = 5;
    // const before = state.recentlyViewed;
    // let after = [];
    // for (let i = 0; i < before.length; i += size) {
    //   let chunk;
    //   let predict = i + size - (before.length - 1);
    //   if (predict > 0) chunk = before.slice(i, i + size);
    //   else chunk = before.slice(i, before.length - 1);
    //   after.push(chunk);
    // }
    // return after;
    return state.recentlyViewed;
  });
  const { device, Devices } = useMediaContext();
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
      />
    );
  return (
    <div className="flex flex-col gap-10 px-24 sm:p-4 md:px-10">
      <Head>
        <title>My Profile</title>
        <meta name="description" content="My Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="card h-full min-h-0">
        <dl>
          <dt className="font-semibold">Full Name:</dt>
          <dd>{data.fullname}</dd>

          <dt className="font-semibold">Date of Birth:</dt>
          <dd>{dateFormat(data.dateOfBirth)}</dd>

          <dt className="font-semibold">Gender:</dt>
          <dd>{data.gender}</dd>

          <dt className="font-semibold">Phone Number:</dt>
          <dd>{data.phoneNumber}</dd>

          <dt className="font-semibold">Email:</dt>
          <dd className="line-clamp-1">{data.email}</dd>
        </dl>
        <Link href="/profile/edit">
          <a className="cursor-pointer rounded-lg border-0 bg-gradient-to-r from-orange-300 to-red-500 px-3 py-2 text-center font-semibold text-white">
            Edit Profile
          </a>
        </Link>
      </div>
      <div className="flex flex-col rounded-3xl">
        <label>Recently Viewed Products</label>
        {recentlyViewed.length ? (
          <div className="relative">
            <ProductSlider products={recentlyViewed} />
          </div>
        ) : (
          <label>You haven&apos; t visited any products</label>
        )}
      </div>
      <MyOrder />
    </div>
  );
}

export default dynamic(() => Promise.resolve(MyProfile), { ssr: false });
