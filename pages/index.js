import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Animation, Timer } from "../components";
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
            <Animation.Zoom className={styles.card}>
              {products?.map((item) => {
                return (
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
                          <label style={{ fontSize: "14px" }}>
                            {item.title}
                          </label>
                          <span>{item.price ? item.price : "optional"} $</span>
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </Animation.Zoom>
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
