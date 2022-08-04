import { useRouter } from "next/router";
import { Loading } from "../components";

export async function getStaticPaths() {
  const data = await fetch(
    "https://blog-coin-2.herokuapp.com/api/blogs?pagesize=5"
  );
  const paths = (await data.json()).data;
  return {
    paths: paths.map((param) => {
      return {
        params: { slug: param.slug },
      };
    }),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  if (!params.slug) return { notFound: true };
  const data = await fetch(
    `https://blog-coin-2.herokuapp.com/api/blogs/slug/${params.slug}`
  );
  const post = (await data.json()).data;
  return {
    props: { post },
    // revalidatie: 300,
  };
}

export default function Blog({ post }) {
  const router = useRouter();
  if (router.isFallback) return <Loading />;
  return (
    <iframe
      srcDoc={post.content}
      frameborder="0"
      style={{ overflow: "hidden", height: "100vw", width: "100vh" }}
    />
  );
}
