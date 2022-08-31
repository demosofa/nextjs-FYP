import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { convertTime, retryAxios } from "../../utils";
import { withAuth } from "../../helpers";
import { Loading } from "../../components";
import { ProgressBar, QRScanner } from "../../containers";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { useState } from "react";
import { Role } from "../../shared";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export const getServerSideProps = withAuth(async ({ req }, role) => {
  let initData = null;
  try {
    const response = await axios.get(`${LocalApi}/order/${req.query.id}`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    initData = response.data;
  } catch (error) {
    console.log(error.message);
  }
  return {
    props: {
      initData,
      auth: role,
    },
  };
});

export default function ShippingProgress({ initData, auth }) {
  const [showQR, setShowQR] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const fetcher = async (config) => {
    retryAxios(axios);
    const response = await axios(config);
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
      fallbackData: initData,
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
      try {
        const response = await axios.put(
          `${LocalApi}/order/${order._id}`,
          undefined
        );
        setShowQR(response.data);
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
      }
    }
  };

  const handleCheckStep = (value) => {
    console.log(value);
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
    <div>
      <ProgressBar
        steps={steps}
        pass={order.status}
        onResult={handleCheckStep}
      ></ProgressBar>
      {showQR !== null && <img src={showQR} alt="QR code"></img>}
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
