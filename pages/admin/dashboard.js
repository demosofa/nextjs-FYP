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
        if (err.status === 300) router.back();
        else if (err.status === 401) router.push("/login");
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
    <div className="flex flex-col gap-10">
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-around">
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
      </div>
      <div className="manage_table">
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
                <td colSpan="5" className="text-center">
                  No customer has bought anything
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
