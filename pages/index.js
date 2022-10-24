import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Animation, Loading } from "../components";
import { useAxiosLoad } from "../hooks";
import { currencyFormat } from "../shared";
import styles from "../styles/Home.module.scss";

const LocalApi = process.env.NEXT_PUBLIC_API;

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
    props: { products, categories, pageCounted, query },
  };
}

export default function Home({ products, categories, pageCounted, query }) {
  const [pageLeft, setPageLeft] = useState(pageCounted);
  const [lstProduct, setLstProduct] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const { loading } = useAxiosLoad({
    async callback(axios) {
      if (currentPage > 1 && pageLeft > 0) {
        const res = await axios({
          url: `${LocalApi}/product/all`,
          params: { ...query, page: currentPage },
        });
        setLstProduct((prev) => [...prev, ...res.data.products]);
        setPageLeft((prev) => prev - 1);
      }
    },
    deps: [currentPage],
  });

  useEffect(() => {
    setLstProduct(products);
    setCurrentPage(1);
    setPageLeft(pageCounted);
  }, [products, pageCounted]);

  return (
    <div className={styles.container}>
      <Head>
        <title>HomePage</title>
        <meta name="description" content="Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="trending"></div>
        <div className="grid grid-cols-fit gap-3">
          <Animation.Fade className="card">
            {categories?.map((category) => (
              <Link
                key={category._id}
                href={{ pathname: "/", query: { category: category.name } }}
              >
                <a className="text-center">{category.name}</a>
              </Link>
            ))}
          </Animation.Fade>
        </div>
        <div className="grid grid-cols-fit-2 gap-6 sm:gap-4">
          <Animation.Zoom className="card relative mt-2 cursor-pointer">
            {lstProduct?.map((item) => (
              <Fragment key={item.title}>
                <div className={styles.price_tag}>
                  <p className={styles.price_tag_price}>
                    {currencyFormat(
                      new Date(item.time).getTime() > Date.now()
                        ? item.sale
                        : item.price
                    ) || "optional"}
                  </p>
                </div>
                {new Date(item.time).getTime() > Date.now() ? (
                  <span className={styles.sale}>
                    -{Math.ceil(100 - (item.sale / item.price) * 100)}%
                  </span>
                ) : null}
                <Link href={`/c/${item._id}`}>
                  <a>
                    <div>
                      <div className="relative h-44 w-full">
                        <Image
                          className="rounded-xl"
                          alt="product"
                          src={item.thumbnail}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                      <label className="text-sm line-clamp-1">
                        {item.title}
                      </label>
                      <label className="float-left">
                        <span className="fa fa-star checked mr-1 text-yellow-300 " />
                        <span className="font-semibold italic">
                          {item.avgRating}
                        </span>
                      </label>
                      <label className="float-right">
                        <span className="font-semibold">Sold: </span>
                        <span className="text-xs text-gray-400">
                          {item.sold}
                        </span>
                      </label>
                    </div>
                  </a>
                </Link>
              </Fragment>
            ))}
          </Animation.Zoom>
        </div>
        {loading && <Loading.Text />}
        {pageLeft > 1 && (
          <button
            className="main_btn mx-auto"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            More Products
          </button>
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
