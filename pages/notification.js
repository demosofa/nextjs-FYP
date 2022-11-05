import Head from "next/head";
import { Notification } from "../containers";

export default function notification() {
  return (
    <>
      <Head>
        <title>Notification</title>
        <meta name="notification" content="Notification" />
      </Head>
      <Notification className="my-3 mx-auto max-w-3xl px-2" />
    </>
  );
}
