import Head from "next/head";
import { CrudCategory } from "../../containers";

export default function Category() {
  return (
    <div>
      <Head>
        <title>Manage Category</title>
        <meta name="description" content="Manage Category" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CrudCategory></CrudCategory>
    </div>
  );
}
