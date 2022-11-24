import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loading } from "../frontend/components";
import { useAuthLoad } from "../frontend/hooks";
import { currencyFormat, Role } from "../shared";

export default function Success() {
  const router = useRouter();
  const { loading, isLoggined, authorized } = useAuthLoad({
    roles: [Role.customer],
  });
  useEffect(() => {
    if (!loading && !isLoggined && !authorized) router.push("/login");
    else if (!loading && !authorized) router.back();
  }, [loading, isLoggined, authorized]);
  if (loading || !isLoggined || !authorized) return <Loading />;
  return (
    <div className="form_center">
      <Head>
        <title>Checkout Order</title>
      </Head>
      <span>Success checkout Order</span>
      <dl>
        <dt>Order Id</dt>
        <dd>{router.query.vnp_TxnRef}</dd>
        <dt>Order price</dt>
        <dd>{currencyFormat(router.query.vnp_Amount / 100)}</dd>
        <dt>Order Info</dt>
        <dd>{router.query.vnp_OrderInfo}</dd>
        <dt>Payment time</dt>
        <dd>{router.query.vnp_PayDate}</dd>
      </dl>
    </div>
  );
}
