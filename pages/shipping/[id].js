import axios from "axios";
import useSWR from "swr";
import dynamic from "next/dynamic";
import decoder from "jwt-decode";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { expireStorage, retryAxios } from "../../utils";
import { convertTime, currencyFormat } from "../../shared";
import { Loading, QRreader } from "../../components";
import { ProgressBar } from "../../containers";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { useEffect, useRef, useState } from "react";
import { Role } from "../../shared";
import Head from "next/head";
import VnPay from "../../containers/VnPay/VnPay";
import { useAblyContext } from "../../contexts/AblyContext";

const LocalApi = process.env.NEXT_PUBLIC_API;
const LocalUrl = process.env.NEXT_PUBLIC_DOMAIN;

function ShippingProgress() {
  const { ably } = useAblyContext();
  const channel = useRef();
  const [showQR, setShowQR] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showVnPay, setShowVnPay] = useState(false);
  const auth = useState(() => {
    const accessToken = expireStorage.getItem("accessToken");
    if (accessToken) {
      const { role, accountId } = decoder(accessToken);
      return { role, accountId };
    }
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
  const {
    data: order,
    error,
    mutate,
  } = useSWR(
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
        if (err.response.status === 300) router.back();
        else if (err.response.status === 401) router.push("/login");
        else dispatch(addNotification({ message: err.message, type: "error" }));
      },
    }
  );

  useEffect(() => {
    if (!channel.current && order) {
      if ([Role.shipper, Role.admin].includes(auth.role))
        channel.current = ably.channels.get(order.customer);
      else if ([Role.guest].includes(auth.role))
        channel.current = ably.channels.get(order.shipper);
    }
  }, [order, auth]);

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
    if (scanData) {
      try {
        const result = await fetcher({
          url: `${LocalApi}/order/${scanData}`,
        });
        if (result._id === router.query.id) {
          setShowScanner(false);
          setShowVnPay(true);
          content = `Customer has scanned QR successfully`;
          channel.current.publish({
            name: "shipping",
            data: {
              message: content,
              type: "success",
            },
          });
        } else {
          throw new Error("This is not your order");
        }
      } catch (error) {
        setShowScanner(false);
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
    }
  };

  const handleCheckStep = (value) => {
    if (value === "arrived") {
      if (auth.role === Role.guest) {
        setShowScanner(true);
      } else if (auth.role === Role.shipper || auth.role === Role.admin) {
        if (order.status !== "arrived") {
          const content = `Your order ${
            order._id
          } has moved to ${value.toUpperCase()} state `;
          mutate(async (data) => {
            await fetcher({
              url: `${LocalApi}/order/${order._id}`,
              method: "patch",
              data: { status: value },
            });
            await fetcher({
              url: `${LocalApi}/notify`,
              method: "post",
              data: {
                to: order.customer,
                content,
              },
            });
            data.status = value;
            return data;
          }, false);
          channel.current.publish({
            name: "shipping",
            data: {
              message: content,
              type: "link",
              href: `${LocalUrl}/shipping/${order._id}`,
            },
          });
        }
        handleShowQr();
      }
    }
  };

  const styles = {
    dt: "mb-1 text-xl font-medium text-gray-900",
    dd: "mb-3 font-normal text-gray-700",
  };

  const steps = [
    { title: "pending", allowed: false },
    { title: "progress", allowed: false },
    { title: "shipping", allowed: false },
    {
      title: "arrived",
      allowed:
        auth.role === Role.shipper || auth.role === Role.admin ? true : false,
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
      />
    );
  return (
    <div className="flex flex-col items-center justify-center">
      <Head>
        <title>Shipping Progress</title>
        <meta name="description" content="Shipping Progress" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <dl className="block max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-md hover:bg-gray-100">
        <dt className={styles.dt}>Order Id</dt>
        <dd className={styles.dd}>{order._id}</dd>
        <dt className={styles.dt}>Address</dt>
        <dd className={styles.dd}>{order.address}</dd>
        <dt className={styles.dt}>Quantity</dt>
        <dd className={styles.dd}>{order.quantity}</dd>
        <dt className={styles.dt}>Shipping Fee</dt>
        <dd className={styles.dd}>{currencyFormat(order.shippingFee)}</dd>
        <dt className={styles.dt}>Total</dt>
        <dd className={styles.dd}>
          {currencyFormat(order.total + order.shippingFee)}
        </dd>
      </dl>
      <ProgressBar
        steps={steps}
        pass={order.status}
        onResult={handleCheckStep}
      />
      {auth.accountId === order.customer &&
      order.status === "arrived" &&
      showVnPay ? (
        <VnPay order={order} />
      ) : null}
      {showQR !== null && (
        <>
          <div className="backdrop" onClick={() => setShowQR(null)} />
          <div className="form_center">
            <img src={showQR} alt="QR code" />
          </div>
        </>
      )}
      {showScanner && (
        <>
          <div className="backdrop" onClick={() => setShowScanner(false)} />
          <div className="form_center">
            <button onClick={() => setShowScanner((prev) => !prev)}>
              Show Scanner
            </button>
            <QRreader
              onScanSuccess={handleScan}
              className="w-full max-w-lg !p-0 sm:max-w-none"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(ShippingProgress), { ssr: false });
