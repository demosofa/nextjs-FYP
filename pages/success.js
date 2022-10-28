import { useRouter } from "next/router";
import { Loading } from "../components";
import { useAuthLoad } from "../hooks";
import { currencyFormat, Role } from "../shared";

export default function Success() {
  const router = useRouter();
  const { loading, isLoggined, isAuthorized } = useAuthLoad({
    roles: [Role.customer],
  });
  useEffect(() => {
    if (!loading && !isLoggined && !isAuthorized) router.push("/login");
    else if (!loading && !isAuthorized) router.back();
  }, [loading, isLoggined, isAuthorized]);
  if (loading || !isLoggined || !isAuthorized) return <Loading />;
  return (
    <div className="form_center">
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
