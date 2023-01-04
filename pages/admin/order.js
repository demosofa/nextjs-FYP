import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import {
  Dropdown,
  Loading,
  Pagination,
  Form,
  Search,
} from "../../frontend/components";
import { addNotification } from "../../frontend/redux/reducer/notificationSlice";
import {
  convertTime,
  currencyFormat,
  dateFormat,
  OrderStatus,
} from "../../shared";
import {
  expireStorage,
  retryAxios,
  tailwindStatus,
} from "../../frontend/utils";
import { BiDownArrow } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import Head from "next/head";
import Select from "react-select";
import Image from "next/image";
import Link from "next/link";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function ManageOrder() {
  const [search, setSearch] = useState("");
  const [displayDelete, setDisplayDelete] = useState();
  const [query, setQuery] = useState({
    search: "",
    page: 1,
    sort: "status",
    status: "",
  });
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
  const { data, error, mutate } = useSWR(
    {
      url: `${LocalApi}/admin/order`,
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

  const handleDeleteOrder = (Id) => {
    mutate(async (data) => {
      try {
        await fetcher({
          url: `${LocalApi}/admin/order`,
          method: "delete",
          data: { Id },
        });
        data.lstOrder = data.lstOrder.filter((order) => order._id !== Id);
        setDisplayDelete(null);
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    }, false);
  };

  const isLoadingInitialData = (!data && !error) || error;
  return (
    <div className="ml-11 sm:ml-2">
      <Head>
        <title>My Shipping</title>
        <meta name="description" content="My Shipping" />
      </Head>
      <div className="flex flex-wrap gap-4">
        <Search
          className="!ml-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setQuery((prev) => ({ ...prev, search }))}
        />
        <Select
          className="w-32 sm:pl-3"
          defaultValue={{ value: "", label: "all" }}
          onChange={({ value }) =>
            setQuery((prev) => ({ ...prev, status: value }))
          }
          options={[
            { value: "", label: "all" },
            { value: OrderStatus.pending, label: "Pending" },
            { value: OrderStatus.progress, label: "Progress" },
            { value: OrderStatus.shipping, label: "Shipping" },
            { value: OrderStatus.arrived, label: "Arrived" },
            { value: OrderStatus.validated, label: "Validated" },
            { value: OrderStatus.paid, label: "Paid" },
            { value: OrderStatus.cancel, label: "Cancel" },
          ]}
        />
      </div>
      {isLoadingInitialData ? (
        <Loading.Text />
      ) : (
        <>
          <div className="flex flex-wrap gap-8 pl-5 sm:justify-center sm:px-3">
            {data.orders.length ? (
              data.orders.map((order) => (
                <div key={order._id} className="card relative mt-2 h-fit">
                  {[
                    OrderStatus.cancel,
                    OrderStatus.pending,
                    OrderStatus.progress,
                    OrderStatus.paid,
                  ].includes(order.status) ? (
                    <IoMdTrash
                      className="absolute right-4"
                      onClick={() => setDisplayDelete(order._id)}
                    />
                  ) : null}
                  <dl className="mt-4">
                    <dt className="font-bold">Id:</dt>
                    <dd className="whitespace-pre-line line-clamp-1">
                      {order._id}
                    </dd>

                    <dt className="font-bold">Customer</dt>
                    <dd className="whitespace-pre-line line-clamp-1">
                      {order.customer}
                    </dd>

                    {order.shipper ? (
                      <>
                        <dt className="font-bold">Shipper</dt>
                        <dd className="whitespace-pre-line line-clamp-1">
                          {order.shipper}
                        </dd>
                      </>
                    ) : null}

                    <dt className="font-bold">Status:</dt>
                    <dd>
                      <span className={tailwindStatus(order.status)}>
                        {order.status}
                      </span>
                    </dd>

                    <dt className="font-bold">Updated At:</dt>
                    <dd>{dateFormat(order.updatedAt)}</dd>
                  </dl>
                  <Dropdown component={<BiDownArrow />}>
                    <Dropdown.Content className="!relative">
                      {order.orderItems.map((item) => (
                        <Link
                          key={item._id}
                          href={`/c/${item.productId}?vid=${item.variationId}`}
                          className="hover:border-2 hover:border-orange-400"
                        >
                          <Image
                            alt="order item image"
                            src={item.image}
                            height={100}
                            width={120}
                          />
                          <dl>
                            <dt className="font-semibold">Name:</dt>
                            <dd className="line-clamp-1">{item.title}</dd>

                            <dt className="font-semibold">Amount:</dt>
                            <dd>{currencyFormat(item.total)}</dd>
                          </dl>
                        </Link>
                      ))}
                    </Dropdown.Content>
                  </Dropdown>
                </div>
              ))
            ) : (
              <label>There is no order</label>
            )}
          </div>
          <Pagination
            className="mt-5"
            currentPage={query.page}
            setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
            totalPageCount={data.pageCounted[0] ? data.pageCounted[0].count : 0}
          >
            <Pagination.Arrow>
              <Pagination.Number />
            </Pagination.Arrow>
          </Pagination>
        </>
      )}
      {displayDelete && (
        <>
          <div className="backdrop" onClick={() => setDisplayDelete(null)} />
          <Form className="form_center">
            <Form.Title>
              Are you sure to delete order {displayDelete}
            </Form.Title>
            <Form.Item>
              <Form.Button onClick={() => handleDeleteOrder(displayDelete)}>
                YES
              </Form.Button>
              <Form.Button onClick={() => setDisplayDelete(null)}>
                NO
              </Form.Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
}
