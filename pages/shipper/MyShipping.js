import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { addNotification } from "../../frontend/redux/reducer/notificationSlice";
import {
  expireStorage,
  retryAxios,
  tailwindStatus,
} from "../../frontend/utils";
import { Loading, Pagination } from "../../frontend/components";
import { useState } from "react";
import Head from "next/head";
import { convertTime, currencyFormat, OrderStatus } from "../../shared";
import { ItemsFromOrder, ThSortOrderBy } from "../../frontend/containers";
import Select from "react-select";

const LocalApi = process.env.NEXT_PUBLIC_API;

function MyShipping() {
  const [viewOrder, setViewOrder] = useState(null);
  const [query, setQuery] = useState({
    page: 1,
    status: "",
    sort: "status",
    orderby: -1,
  });
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
      url: `${LocalApi}/shipper`,
      params: query,
    },
    fetcher,
    {
      refreshInterval: convertTime("5s").milisecond,
      dedupingInterval: convertTime("5s").milisecond,
      onError(err, key, config) {
        if (err?.response?.status === 403) router.back();
        else if (err?.response?.status === 401) router.push("/login");
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

  const isLoadingInitialData = (!data && !error) || error;

  return (
    <div className="px-24 sm:p-4 md:px-10">
      <Head>
        <title>My Shipping</title>
        <meta name="description" content="My Shipping" />
      </Head>
      <Select
        className="w-32"
        defaultValue={{ value: "", label: "all" }}
        onChange={({ value }) =>
          setQuery((prev) => ({ ...prev, status: value }))
        }
        options={[
          { value: "", label: "all" },
          { value: OrderStatus.progress, label: "Progress" },
          { value: OrderStatus.shipping, label: "Shipping" },
          { value: OrderStatus.arrived, label: "Arrived" },
          { value: OrderStatus.validated, label: "Validated" },
          { value: OrderStatus.paid, label: "Paid" },
          { value: OrderStatus.cancel, label: "Cancel" },
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
                  <ThSortOrderBy
                    query={query}
                    setQuery={setQuery}
                    target="status"
                  >
                    Status
                  </ThSortOrderBy>
                  <th>Customer</th>
                  <ThSortOrderBy
                    query={query}
                    setQuery={setQuery}
                    target="address"
                  >
                    Address
                  </ThSortOrderBy>
                  <th>Phone Number</th>
                  <ThSortOrderBy
                    query={query}
                    setQuery={setQuery}
                    target="total"
                  >
                    Total Price
                  </ThSortOrderBy>
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
                          {order.status === OrderStatus.progress && (
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
