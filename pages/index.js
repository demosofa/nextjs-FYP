import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Animation } from "../components";
import Layout from "../Layout";
import styles from "../styles/Home.module.scss";

export async function getStaticProps() {
  const data = await fetch("https://fakestoreapi.com/products");
  const products = await data.json();
  return {
    props: { products },
  };
}

export default function Home({ products }) {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className="trending"></div>
          <div className={styles.grid}>
            {[...products].map((item) => {
              return (
                <Link href={`/overview/${item.id}`} key={item.title}>
                  <a>
                    <Animation.Fade key={item.title} className={styles.card}>
                      <div>
                        <img src={item.image}></img>
                        <span>{item.title}</span>
                      </div>
                    </Animation.Fade>
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
