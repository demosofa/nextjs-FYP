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
  const { data, error } = useSWR(
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

  console.log(data);

  if (!data || error) return <Loading.Text />;
  return (
    <div>
      <div className="grid">
        {data.lstOrder.map((order) => (
          <div key={order._id} className="card">
            <dl>
              <dt>Id</dt>
              <dd>{order._id}</dd>
            </dl>
            <dl>
              <dt>Status</dt>
              <dd>{order.status}</dd>
            </dl>
            <dl>
              <dt>Created At</dt>
              <dd>{order.createdAt}</dd>
            </dl>
            <Dropdown icon={<BiDownArrow />} hoverable={true}>
              {order.orderItems.map((item) => (
                <div key={item._id}>
                  <dl>
                    <dt>Name</dt>
                    <dd>{item.title}</dd>
                  </dl>
                  <dl>
                    <dt>Amount</dt>
                    <dd>{item.total}</dd>
                  </dl>
                </div>
              ))}
            </Dropdown>
          </div>
        ))}
      </div>
    </div>
  );
}
