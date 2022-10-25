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
        if (err?.response?.status === 403) router.back();
        else if (err?.response?.status === 401) router.push("/login");
        else dispatch(addNotification({ message: err.message, type: "error" }));
      },
    }
  );

  useEffect(() => {
    if (!channel.current && order) {
      if ([Role.shipper, Role.admin].includes(auth.role))
        channel.current = ably.channels.get(order.customer._id);
      else if ([Role.guest].includes(auth.role))
        channel.current = ably.channels.get(order.shipper._id);
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

  const handleScan = (scanData, _, html5QR) => {
    if (scanData) {
      html5QR.pause();
      mutate(async (data) => {
        try {
          await fetcher({
            url: `${LocalApi}/order/${scanData}`,
            method: "patch",
            data: { orderId: router.query.id },
          });
          setShowScanner(false);
          let content = `Customer has scanned QR successfully`;
          channel.current.publish({
            name: "shipping",
            data: {
              message: content,
              type: "success",
            },
          });
          data.status = "validated";
        } catch (error) {
          setShowScanner(false);
          dispatch(addNotification({ message: error.message, type: "error" }));
        }
        return data;
      }, false);
    }
  };

  const arrivedState = () => {
    if (
      (auth.role === Role.guest || auth.role === Role.admin) &&
      auth.accountId === order.customer._id
    ) {
      setShowScanner(true);
    } else if (
      (auth.role === Role.shipper || auth.role === Role.admin) &&
      auth.accountId === order.shipper._id
    ) {
      if (order.status !== "arrived") {
        const content = `Your order ${
          order._id
        } has moved to ${"arrived".toUpperCase()} state `;
        mutate(async (data) => {
          try {
            await fetcher({
              url: `${LocalApi}/order/${order._id}`,
              method: "patch",
              data: { status: "arrived" },
            });
            await fetcher({
              url: `${LocalApi}/notify`,
              method: "post",
              data: {
                to: order.customer._id,
                content,
              },
            });
            data.status = "arrived";
          } catch (error) {
            dispatch(
              addNotification({ message: error.message, type: "error" })
            );
          }
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
  };

  const validatedState = () => {
    if (
      (auth.role === Role.guest || auth.role === Role.admin) &&
      auth.accountId === order.customer._id
    ) {
      setShowVnPay(true);
    }
  };

  const handleCheckStep = (value) => {
    switch (value) {
      case "arrived":
        return arrivedState();
      case "validated":
        return validatedState();
    }
  };

  const styles = {
    dt: "mb-1 text-xl font-medium text-gray-900",
    dd: "mb-3 font-normal text-gray-700",
  };

  const steps =
    !order || error
      ? []
      : [
          { title: "pending", allowed: false },
          { title: "progress", allowed: false },
          { title: "shipping", allowed: false },
          {
            title: "arrived",
            allowed:
              order.status === "arrived" &&
              (auth.role === Role.shipper || auth.role === Role.admin)
                ? true
                : false,
          },
          {
            title: "validated",
            allowed:
              order.status === "validated" &&
              (auth.role === Role.guest || auth.role === Role.admin)
                ? true
                : false,
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
          {currencyFormat(order.total)}
          <span>(Shipping fee not included)</span>
        </dd>
      </dl>
      <ProgressBar
        steps={steps}
        pass={order.status}
        onResult={handleCheckStep}
      />
      {auth.accountId === order.customer._id &&
      order.status === "validated" &&
      showVnPay ? (
        <>
          <div className="backdrop" onClick={() => setShowVnPay(false)} />
          <VnPay className="form_center" order={order} />
        </>
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
          <QRreader
            onScanSuccess={handleScan}
            className="form_center !fixed w-full max-w-lg !p-0 sm:max-w-none"
          />
        </>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(ShippingProgress), { ssr: false });
