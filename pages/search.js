import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Pagination } from "../components";
import { ProductCard } from "../containers";
import { addNotification } from "../redux/reducer/notificationSlice";

const LocalApi = process.env.NEXT_PUBLIC_API;

export async function getServerSideProps({ query }) {
  if (!query.page) query = { ...query, page: 1 };
  const resProduct = await fetch(
    `${LocalApi}/product/all?` + new URLSearchParams(query)
  );
  const { products, pageCounted } = await resProduct.json();
  return {
    props: {
      query,
      products,
      pageCounted,
    },
  };
}

export default function SearchProduct({ query, products, pageCounted }) {
  const [pricing, setPricing] = useState({ from: 1000, to: 1000000 });
  const [rating, setRating] = useState({ from: 0, to: 5 });
  const dispatch = useDispatch();
  const router = useRouter();
  const applyPricing = () => {
    if (
      pricing.from > 0 &&
      pricing.to > 0 &&
      pricing.from % 1000 === 0 &&
      pricing.to % 1000 === 0
    )
      router.push({
        pathname: "/search",
        query: { ...query, pricing: pricing.from + "," + pricing.to },
      });
    else
      dispatch(
        addNotification({
          message: "input pricing should be VND currency",
          type: "error",
        })
      );
  };
  return (
    <div className="flex gap-5">
      <aside className="flex flex-1 flex-col">
        <div className="flex flex-col">
          <div className="flex">
            <input
              className="min-w-fit flex-1"
              value={rating.from}
              onChange={(e) => {
                if (e.target.value >= 0)
                  setRating((prev) => ({ ...prev, from: e.target.value }));
              }}
            />
            <span>-</span>
            <input
              className="min-w-fit flex-1"
              value={rating.to}
              onChange={(e) => {
                if (e.target.value <= 5)
                  setRating((prev) => ({ ...prev, to: e.target.value }));
              }}
            />
          </div>
          <button
            onClick={() =>
              router.push({
                pathname: "/search",
                query: { ...query, rating: rating.from + "," + rating.to },
              })
            }
          >
            Apply
          </button>
        </div>
        <div className="flex flex-col">
          <div className="flex">
            <input
              className="min-w-fit flex-1"
              value={pricing.from}
              onChange={(e) => {
                setPricing((prev) => ({ ...prev, from: e.target.value }));
              }}
            />
            <span>-</span>
            <input
              className="min-w-fit flex-1"
              value={pricing.to}
              onChange={(e) => {
                setPricing((prev) => ({ ...prev, to: e.target.value }));
              }}
            />
          </div>
          <button onClick={applyPricing}>Apply</button>
        </div>
      </aside>
      <div className="flex flex-4 flex-col gap-6">
        <div className="flex gap-5">
          <Link
            href={{
              pathname: "/search",
              query: { ...query, keyword: "popular" },
            }}
          >
            <a>Popular</a>
          </Link>
          <Link
            href={{
              pathname: "/search",
              query: { ...query, keyword: "latest" },
            }}
          >
            <a>Latest</a>
          </Link>
        </div>
        <div>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              href={`${LocalApi}/c/${product._id}`}
              product={product}
            />
          ))}
        </div>
        <Pagination
          totalPageCount={pageCounted}
          currentPage={query.page}
          setCurrentPage={(page) => {
            router.push({ pathname: "/search", query: { ...query, page } });
          }}
        >
          <Pagination.Arrow>
            <Pagination.Number />
          </Pagination.Arrow>
        </Pagination>
      </div>
    </div>
  );
}
