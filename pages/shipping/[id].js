import axios from "axios";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { convertTime, expireStorage, retryAxios } from "../../utils";
import { Loading } from "../../components";
import { ProgressBar, QRScanner } from "../../containers";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { useState } from "react";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function ShippingProgress() {
  const [showQR, setShowQR] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
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
  const { data: order, error } = useSWR(
    router.isReady
      ? {
          url: `${LocalApi}/order/${router.query.id}`,
        }
      : null,
    fetcher,
    {
      refreshInterval: convertTime("5s").milisecond,
      dedupingInterval: convertTime("5s").milisecond,
      onError(err, key, config) {
        if (err.status === 300) return router.back();
        else if (err.status === 401) return router.push("/login");
        else return dispatch(addNotification({ message: err }));
      },
    }
  );

  const handleShowQr = async () => {
    if (showQR !== null) setShowQR(null);
    else {
      retryAxios(axios);
      const accessToken = expireStorage.getItem("accessToken");
      try {
        const response = await axios.put(
          `${LocalApi}/order/${order._id}`,
          undefined,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setShowQR(response.data);
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
      }
    }
  };

  const steps = [
    { title: "pending", allowed: false },
    { title: "arrived", allowed: false },
    { title: "paid", allowed: false },
  ];

  if (!order || error)
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
    <div>
      <button onClick={handleShowQr}>Show QR</button>
      <ProgressBar steps={steps} pass={order.status}></ProgressBar>
      <button onClick={() => setShowScanner((prev) => !prev)}>
        Show Scanner
      </button>
      {showQR !== null && <img src={showQR} alt="QR code"></img>}
      {showScanner && <QRScanner></QRScanner>}
    </div>
  );
}

export default dynamic(() => Promise.resolve(ShippingProgress), { ssr: false });
