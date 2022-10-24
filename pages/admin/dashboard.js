import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { Loading } from "../../components";
import { Widget } from "../../containers";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { expireStorage, retryAxios } from "../../utils";
import Head from "next/head";
import Image from "next/image";

const LocalApi = process.env.NEXT_PUBLIC_API;

function Dashboard() {
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
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, error } = useSWR(
    { url: `${LocalApi}/admin/topSellingProduct` },
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError(err, key, config) {
        if (err.response.status === 300) router.back();
        else if (err.response.status === 401) router.push("/login");
        else dispatch(addNotification({ message: err.message, type: "error" }));
      },
    }
  );

  if (!data || error)
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-wrap gap-3">
        <Widget
          url={`${LocalApi}/admin/income`}
          description="Compare to last month"
        >
          Revenue
        </Widget>
        <Widget
          url={`${LocalApi}/admin/profitMonthly`}
          description="Compare to last month"
        >
          Profit
        </Widget>
        <Widget
          url={`${LocalApi}/admin/newUsers`}
          description="Compare to last month"
        >
          New Users
        </Widget>
        <Widget
          url={`${LocalApi}/admin/totalOrder`}
          description="Compare to last month"
        >
          Orders
        </Widget>
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
                      width="100px"
                      height="90px"
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

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
