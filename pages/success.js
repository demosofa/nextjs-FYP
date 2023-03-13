import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loading } from "../frontend/components";
import { useAuthLoad } from "../frontend/hooks";
import { currencyFormat, Role } from "../shared";

export default function Success() {
  const router = useRouter();
  const { loading, isLogged, authorized } = useAuthLoad({
    roles: [Role.customer],
  });
  useEffect(() => {
    if (!loading && !isLogged && !authorized) router.push("/login");
    else if (!loading && !authorized) router.back();
  }, [loading, isLogged, authorized]);
  if (loading || !isLogged || !authorized) return <Loading />;
  return (
    <div className="form_center">
      <Head>
        <title>Checkout Order</title>
        <meta name="description" content="Checkout Order" />
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
