import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { expireStorage, retryAxios, tailwindStatus } from "../../utils";
import { Loading, Pagination } from "../../components";
import { useState } from "react";
import Head from "next/head";
import { currencyFormat } from "../../shared";
import { ItemsFromOrder } from "../../containers";
import Select from "react-select";

const LocalApi = process.env.NEXT_PUBLIC_API;

function MyShipping() {
  const [viewOrder, setViewOrder] = useState(null);
  const [query, setQuery] = useState({ page: 1, sort: "status", status: "" });
  const [showQR, setShowQR] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
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
  const { data, error } = useSWR(
    {
      url: `${LocalApi}/shipper?page=${query.page}&sort=${query.sort}&status=${query.status}`,
    },
    fetcher,
    {
      onError(err, key, config) {
        if (err.response.status === 300) router.back();
        else if (err.response.status === 401) router.push("/login");
        else dispatch(addNotification({ message: err.message, type: "error" }));
      },
    }
  );

  const handleShowQR = async (orderId) => {
    try {
      const linkQR = await fetcher({
        url: `${LocalApi}/order/${orderId}`,
        method: "put",
      });
      setShowQR(linkQR);
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };

  const isLoadingInitialData = !data && !error;

  return (
    <div className="px-24 sm:p-4 md:px-10">
      <Head>
        <title>My Shipping</title>
        <meta name="description" content="My Shipping" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Select
        className="w-32"
        defaultValue={{ value: "", label: "all" }}
        onChange={({ value }) =>
          setQuery((prev) => ({ ...prev, status: value }))
        }
        options={[
          { value: "", label: "all" },
          { value: "progress", label: "Progress" },
          { value: "shipping", label: "Shipping" },
          { value: "arrived", label: "Arrived" },
          { value: "validated", label: "Validated" },
          { value: "cancel", label: "Cancel" },
        ]}
      />
      {isLoadingInitialData ? (
        <Loading.Dots />
      ) : (
        <>
          <div className="manage_table">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Order Id</th>
                  <th>Status</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Total Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.lstShipping.length ? (
                  data?.lstShipping.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order._id}</td>
                      <td>
                        <span className={tailwindStatus(order.status)}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.customer.username}</td>
                      <td>
                        <a
                          className="font-semibold uppercase text-blue-600 hover:text-blue-400"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://maps.google.com/maps?q=${order.address}`}
                        >
                          {order.address}
                        </a>
                      </td>
                      <td>{order.customer.user.phoneNumber}</td>
                      <td>{currencyFormat(order.total)}</td>
                      <td>
                        <div className="flex flex-col items-center">
                          <button
                            className="mr-5 whitespace-nowrap uppercase text-green-600 hover:text-green-900 focus:underline focus:outline-none"
                            onClick={() => setViewOrder(order.orderItems)}
                          >
                            View List item
                          </button>
                          {order.status === "progress" && (
                            <button
                              className="mr-5 whitespace-nowrap uppercase text-indigo-600 hover:text-indigo-900 focus:underline focus:outline-none"
                              onClick={() => handleShowQR(order._id)}
                            >
                              Show QR to seller
                            </button>
                          )}
                          <Link href={`/shipping/${order._id}`}>
                            <a className="mr-5 whitespace-nowrap uppercase text-purple-600 hover:text-purple-900 focus:underline focus:outline-none">
                              Manage Progress
                            </a>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">
                      <p className="text-center">
                        Go to this{" "}
                        <Link href="/shipper">
                          <a className="uppercase text-gray-400 hover:text-orange-500">
                            page
                          </a>
                        </Link>{" "}
                        and accept orders first
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            className="mt-8"
            totalPageCount={data.pageCounted}
            currentPage={query.page}
            setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
          >
            <Pagination.Arrow>
              <Pagination.Number />
            </Pagination.Arrow>
          </Pagination>
        </>
      )}
      {viewOrder && (
        <ItemsFromOrder viewOrder={viewOrder} setViewOrder={setViewOrder} />
      )}
      {showQR && (
        <>
          <div className="backdrop" onClick={() => setShowQR(null)} />
          <div className="form_center">
            <img src={showQR} alt="QR code" />
          </div>
        </>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(MyShipping), { ssr: false });
