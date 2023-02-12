import decoder from "jwt-decode";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import { Loading } from "../frontend/components";
import { Widget } from "../frontend/containers";
import { expireStorage } from "../frontend/utils";
import { Role } from "../shared";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function Dashboard() {
  const router = useRouter();
  const auth = useState(() => {
    const accessToken = expireStorage.getItem("accessToken");
    if (accessToken) {
      const { role, accountId } = decoder(accessToken);
      return { role, accountId };
    } else router.push("/login");
  })[0];
  const widgetRoutes =
    (auth &&
      auth.role === Role.admin && [
        {
          path: "/admin/income",
          title: "Revenue",
          desc: "Compare to last month",
        },
        {
          path: "/admin/profitMonthly",
          title: "Profit",
          desc: "Compare to last month",
        },
        {
          path: "/admin/newUsers",
          title: "New Users",
          desc: "Compare to last month",
        },
        {
          path: "/admin/totalOrder",
          title: "Orders",
          desc: "Compare to last month",
        },
      ]) ||
    (auth.role === Role.seller && [
      {
        path: "/seller/income",
        title: "Revenue",
        desc: "Compare to yesterday",
      },
      {
        path: "/seller/totalOrder",
        title: "Orders",
        desc: "Compare to yesterday",
      },
    ]);

  const { isLoading, data } = useSWR(
    {
      url: `${LocalApi}/${
        auth.role === Role.admin || auth.role === Role.seller
          ? auth.role
          : Role.seller
      }/topSellingProduct`,
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading)
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
    <div className="m-10 flex flex-col gap-10 sm:m-2">
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
      </Head>
      <div className="flex flex-wrap gap-3">
        {widgetRoutes.map((info) => (
          <Widget
            key={info.title}
            url={LocalApi + info.path}
            description={info.desc}
          >
            {info.title}
          </Widget>
        ))}
      </div>
      <div className="manage_table">
        <label>Top 10 product sold</label>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Image</th>
              <th>Id</th>
              <th className="w-[40%]">Title</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Image
                      className="h-20 w-28"
                      src={product.image}
                      alt="product"
                      width={100}
                      height={90}
                    />
                  </td>
                  <td>{product._id}</td>
                  <td className="group">
                    <p className="line-clamp-1 group-hover:line-clamp-none">
                      {product.title}
                    </p>
                  </td>
                  <td>{product.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <p className="text-center">
                    There is any product that has been bought or ordered
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
