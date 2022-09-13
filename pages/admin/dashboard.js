import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { Loading } from "../../components";
import { FeaturedInfo } from "../../containers";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { retryAxios } from "../../utils";
import Head from "next/head";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function Dashboard() {
  const fetcher = async (config) => {
    retryAxios(axios);
    const response = await axios(config);
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
        if (err.response.status === 300) return router.back();
        else if (err.response.status === 401) return router.push("/login");
        else return dispatch(addNotification({ message: err.message }));
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
      ></Loading>
    );
  return (
    <div className="flex flex-col gap-10">
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-around">
        <FeaturedInfo url={`${LocalApi}/admin/income`}>Revenue</FeaturedInfo>
        <FeaturedInfo url={`${LocalApi}/admin/profitMonthly`}>
          Profit
        </FeaturedInfo>
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
            {data?.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <img
                    className="h-20 w-28"
                    src={product.image}
                    alt="product"
                  ></img>
                </td>
                <td>{product._id}</td>
                <td>
                  <p className="line-clamp-1 hover:line-clamp-none">
                    {product.title}
                  </p>
                </td>
                <td>{product.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
