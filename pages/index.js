import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Animation } from "../components";
import Layout from "../Layout";
import styles from "../styles/Home.module.scss";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export async function getStaticProps() {
  let products = null;
  try {
    const data = await fetch(`${LocalApi}/product/all`);
    products = await data.json();
  } catch (error) {
    console.log(error);
  }
  return {
    props: { products },
  };
}

export default function Home({ products }) {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>HomePage</title>
          <meta name="description" content="Homepage" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className="trending"></div>
          <div className={styles.grid}>
            {products?.map((item) => {
              return (
                <Link href={`/overview/${item._id}`} key={item.title}>
                  <a>
                    <Animation.Zoom key={item.title} className={styles.card}>
                      <div style={{ padding: "5px", fontSize: "13px" }}>
                        <img
                          src={item.images[0].url}
                          style={{ height: "175px", borderRadius: "10px" }}
                        ></img>
                        <span>{item.title}</span>
                      </div>
                    </Animation.Zoom>
                  </a>
                </Link>
              );
            })}
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <span className={styles.logo}>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer>
      </div>
    </Layout>
  );
}
