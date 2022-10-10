import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { Dropdown, Loading } from "../../components";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { convertTime } from "../../shared";
import { expireStorage, retryAxios } from "../../utils";
import { BiDownArrow } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function ManageOrder() {
  const [query, setQuery] = useState({ page: 1, sort: "status", filter: "" });
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
    { url: `${LocalApi}/admin/order?page=${query.page}&sort=${query.sort}` },
    fetcher,
    {
      refreshInterval: convertTime("5s").milisecond,
      dedupingInterval: convertTime("5s").milisecond,
      onError(err, key, config) {
        if (err.response.status === 300) return router.back();
        else if (err.response.status === 401) return router.push("/login");
        else
          return dispatch(
            addNotification({ message: err.message, type: "error" })
          );
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
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    }, false);
  };

  if (!data || error) return <Loading.Text />;
  return (
    <div>
      <div className="flex flex-wrap justify-around">
        {data.lstOrder.map((order) => (
          <div key={order._id} className="card flat_dl relative mt-5 h-fit">
            {order.status === "cancel" ? (
              <IoMdTrash
                className="absolute right-4"
                onClick={() => handleDeleteOrder(order._id)}
              />
            ) : null}
            <dl>
              <dt className="font-bold">Id:</dt>
              <dd>{order._id}</dd>
            </dl>
            <dl>
              <dt className="font-bold">Status:</dt>
              <dd>{order.status}</dd>
            </dl>
            <dl>
              <dt className="font-bold">Created At:</dt>
              <dd>{order.createdAt}</dd>
            </dl>
            <Dropdown icon={<BiDownArrow />}>
              <Dropdown.Content className="!relative">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flat_dl">
                    <dl>
                      <dt className="font-semibold">Name:</dt>
                      <dd>{item.title}</dd>
                    </dl>
                    <dl>
                      <dt className="font-semibold">Amount:</dt>
                      <dd>{item.total}</dd>
                    </dl>
                  </div>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </div>
        ))}
      </div>
    </div>
  );
}
