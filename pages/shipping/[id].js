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
import { useContext, useEffect, useRef, useState } from "react";
import { Role } from "../../shared";
import QrScanner from "react-qr-scanner";
import Head from "next/head";
import { AblyFe } from "../../layouts";
import VnPay from "../../containers/VnPay/VnPay";

const LocalApi = process.env.NEXT_PUBLIC_API;
const LocalUrl = process.env.NEXT_PUBLIC_DOMAIN;

function ShippingProgress() {
  const { ably } = useContext(AblyFe);
  const channel = useRef();
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
        else
          return dispatch(
            addNotification({ message: err.message, type: "error" })
          );
      },
    }
  );

  useEffect(() => {
    if (!channel.current && order)
      channel.current = ably.channels.get(order.customer);
  }, [order]);

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
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    }
  };

  const handleScan = async (scanData) => {
    if (scanData && scanData !== "") {
      try {
        const result = await fetcher({
          url: `${LocalApi}/order/${scanData.text}`,
        });
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    }
  };

  const handleCheckStep = (value) => {
    if (value === "arrived") {
      if (auth === Role.guest) {
        setShowScanner(true);
      } else if (auth === Role.shipper || auth === Role.admin) {
        channel.current.publish({
          name: "shipping",
          data: {
            message: `Your order ${
              order._id
            } has moved to ${value.toUpperCase()} state `,
            type: "link",
            href: `${LocalUrl}/shipping/${order._id}`,
          },
        });
        handleShowQr();
      }
    }
  };

  const steps = [
    { title: "pending", allowed: false },
    { title: "progress", allowed: false },
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
      <VnPay order={order} />
      {showQR !== null && (
        <>
          <div className="backdrop" onClick={() => setShowQR(null)}></div>
          <div className="form_center">
            <img src={showQR} alt="QR code"></img>
          </div>
        </>
      )}
      {showScanner && (
        <>
          <div className="backdrop" onClick={() => setShowScanner(false)}></div>
          <div className="form_center">
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
        </>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(ShippingProgress), { ssr: false });
