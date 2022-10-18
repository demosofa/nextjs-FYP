import { useRouter } from "next/router";

export function getServerSideProps({ query }) {
  return {
    props: {
      query,
    },
  };
}

export default function Success({ query }) {
  const router = useRouter();
  return (
    <div className="form_center">
      <span>Success checkout Order</span>
      <dl>
        <dt>Order Id</dt>
        <dd>{query.vnp_TxnRef}</dd>
        <dt>Order price</dt>
        <dd>{query.vnp_Amount}</dd>
        <dt>Order Info</dt>
        <dd>{query.vnp_OrderInfo}</dd>
        <dt>Payment time</dt>
        <dd>{query.vnp_PayDate}</dd>
      </dl>
    </div>
  );
}
