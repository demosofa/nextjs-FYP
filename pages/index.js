import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Animation, Loading, Timer } from "../components";
import { useAxiosLoad } from "../hooks";
import styles from "../styles/Home.module.scss";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;
const LocalUrl = process.env.NEXT_PUBLIC_LOCAL_URL;

export async function getServerSideProps({ query }) {
  let products = null;
  let pageCounted = 0;
  let categories = null;
  try {
    const resProducts = await axios.get(`${LocalApi}/product/all`, {
      params: query,
    });
    const result = resProducts.data;
    products = result.products;
    pageCounted = result.pageCounted;
    const resCategories = await axios.get(`${LocalApi}/category/all`);
    categories = resCategories.data;
  } catch (error) {}
  return {
    props: { products, categories, pageCounted },
  };
}

export default function Home({ products, categories, pageCounted }) {
  const [pageLeft, setPageLeft] = useState(pageCounted);
  const [lstProduct, setLstProduct] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const { loading } = useAxiosLoad({
    async callback(axios) {
      if (currentPage > 1 && pageLeft > 0) {
        const res = await axios({
          url: `${LocalUrl}`,
          params: { page: currentPage },
        });
        setLstProduct((prev) => [...prev, res.data]);
        setPageLeft((prev) => prev - 1);
      }
    },
    deps: [currentPage],
  });

  useEffect(() => setLstProduct(products), [products]);

  return (
    <div className={styles.container}>
      <Head>
        <title>HomePage</title>
        <meta name="description" content="Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="trending"></div>
        <div className={styles.grid}>
          <Animation.Fade className={styles.card}>
            {categories?.map((category) => (
              <Link
                key={category._id}
                href={{ pathname: "/", query: { category: category.name } }}
              >
                <a>{category.name}</a>
              </Link>
            ))}
          </Animation.Fade>
        </div>
        <div className={styles.grid}>
          <Animation.Zoom className={styles.card}>
            {lstProduct?.map((item) => (
              <Link href={`/overview/${item._id}`} key={item.title}>
                <a>
                  {item.time && <Timer value={item.time} />}
                  <div style={{ padding: "5px", fontSize: "13px" }}>
                    <img
                      src={item.images[0].url}
                      style={{ height: "175px", borderRadius: "10px" }}
                    ></img>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <label style={{ fontSize: "14px" }}>{item.title}</label>
                      <span>{item.price ? item.price : "optional"} $</span>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </Animation.Zoom>
        </div>
        {loading && <Loading.Text />}
        {pageLeft - 1 > 0 && (
          <a onClick={() => setCurrentPage((prev) => prev + 1)}>
            More Products
          </a>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
