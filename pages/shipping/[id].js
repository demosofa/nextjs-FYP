import axios from "axios";
import useSWR from "swr";
import dynamic from "next/dynamic";
import decoder from "jwt-decode";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { expireStorage, retryAxios } from "../../utils";
import { convertTime } from "../../shared";
import { Loading } from "../../components";
import { ProgressBar } from "../../containers";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { useState } from "react";
import { Role } from "../../shared";
import QrScanner from "react-qr-scanner";
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
      try {
        const data = await fetcher({
          url: `${LocalApi}/order/${order._id}`,
          method: "put",
        });
        setShowQR(data);
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
      }
    }
  };

  const handleScan = async (scanData) => {
    if (scanData && scanData !== "") {
      try {
        const result = await fetcher({
          url: `${LocalApi}/order/${scanData}`,
        });
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
    { title: "validated", allowed: false },
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
          <QrScanner
            facingMode="front"
            delay={500}
            onError={(err) => dispatch(addNotification({ message: err }))}
            onScan={handleScan}
            className="h-80 w-80"
          />
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(ShippingProgress), { ssr: false });
