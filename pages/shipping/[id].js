import axios from "axios";
import useSWR from "swr";
import dynamic from "next/dynamic";
import decoder from "jwt-decode";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { convertTime, expireStorage, retryAxios } from "../../utils";
import { Loading } from "../../components";
import { ProgressBar, QRScanner } from "../../containers";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { useState } from "react";
import { Role } from "../../shared";
import Head from "next/head";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

function ShippingProgress() {
  const [showQR, setShowQR] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const auth = useState(() => {
    const accessToken = expireStorage.getItem("accessToken");
    const { role } = decoder(accessToken);
    return role;
  })[0];
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
        else return dispatch(addNotification({ message: err.message }));
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

  const handleCheckStep = (value) => {
    if (value === "arrived") {
      if (auth === Role.guest) {
        setShowScanner(true);
      } else if (auth === Role.shipper || auth === Role.admin) {
        handleShowQr();
      }
    }
  };

  const steps = [
    { title: "pending", allowed: false },
    { title: "shipping", allowed: false },
    {
      title: "arrived",
      allowed: auth === Role.shipper || auth === Role.admin ? true : false,
    },
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
    <div className="flex flex-col items-center justify-center">
      <Head>
        <title>Shipping Progress</title>
        <meta name="description" content="Shipping Progress" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProgressBar
        steps={steps}
        pass={order.status}
        onResult={handleCheckStep}
      ></ProgressBar>
      {showQR !== null && (
        <img className="w-40" src={showQR} alt="QR code"></img>
      )}
      {showScanner && (
        <div>
          <button onClick={() => setShowScanner((prev) => !prev)}>
            Show Scanner
          </button>
          <QRScanner></QRScanner>
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(ShippingProgress), { ssr: false });
