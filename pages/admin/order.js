import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { Dropdown, Loading, Pagination, Form } from "../../components";
import { addNotification } from "../../redux/reducer/notificationSlice";
import {
  convertTime,
  currencyFormat,
  dateFormat,
  OrderStatus,
} from "../../shared";
import { expireStorage, retryAxios, tailwindStatus } from "../../utils";
import { BiDownArrow } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import Head from "next/head";
import Select from "react-select";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function ManageOrder() {
  const [displayDelete, setDisplayDelete] = useState();
  const [query, setQuery] = useState({ page: 1, sort: "status", status: "" });
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
      url: `${LocalApi}/admin/order?page=${query.page}&sort=${query.sort}&status=${query.status}`,
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
          { value: OrderStatus.cancel, label: "Cancel" },
        ]}
      />
      {isLoadingInitialData ? (
        <Loading.Text />
      ) : (
        <>
          <div className="flex flex-wrap gap-8 pl-5 sm:justify-center sm:px-3">
            {data.lstOrder.length ? (
              data.lstOrder.map((order) => (
                <div key={order._id} className="card relative mt-2 h-fit">
                  {/* {order.status === "cancel" ? (
                    <IoMdTrash
                      className="absolute right-4"
                      onClick={() => setDisplayDelete(order._id)}
                    />
                  ) : null} */}
                  <IoMdTrash
                    className="absolute right-4"
                    onClick={() => setDisplayDelete(order._id)}
                  />
                  <dl>
                    <dt className="font-bold">Id:</dt>
                    <dd className="whitespace-pre-line line-clamp-1">
                      {order._id}
                    </dd>

                    <dt className="font-bold">Status:</dt>
                    <dd>
                      <span className={tailwindStatus(order.status)}>
                        {order.status}
                      </span>
                    </dd>

                    <dt className="font-bold">Created At:</dt>
                    <dd>{dateFormat(order.createdAt)}</dd>
                  </dl>
                  <Dropdown component={<BiDownArrow />}>
                    <Dropdown.Content className="!relative">
                      {order.orderItems.map((item) => (
                        <div
                          key={item._id}
                          className="hover:border-2 hover:border-orange-400"
                        >
                          <dl>
                            <dt className="font-semibold">Name:</dt>
                            <dd className="line-clamp-1">{item.title}</dd>

                            <dt className="font-semibold">Amount:</dt>
                            <dd>{currencyFormat(item.total)}</dd>
                          </dl>
                        </div>
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
            totalPageCount={data.pageCounted}
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
