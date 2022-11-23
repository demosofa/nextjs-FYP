import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { currencyFormat } from "../../../shared";
import styles from "./_productcard.module.scss";

export default function ProductCard({ product, className, ...props }) {
  const { price, compare } = useMemo(() => {
    if (product.compare)
      return { price: product.price, compare: product.compare };
    else return { price: product.price, compare: 0 };
  }, [product]);
  return (
    <Link {...props}>
      <a className={`card relative cursor-pointer !p-0 ${className}`}>
        {compare ? (
          <span className={styles.discount}>
            -{Math.ceil(100 - (price / compare) * 100)}%
          </span>
        ) : null}
        <div className="relative h-44 w-full">
          <Image
            className="rounded-sm"
            alt="product"
            src={product.thumbnail}
            layout="fill"
            objectFit="fill"
          />
        </div>
        <div className="mx-2 mt-2 flex flex-col">
          <label className="text-sm line-clamp-1">{product.title}</label>
          <div className="flex w-full items-center justify-around">
            <label>
              <span className="mr-1 font-semibold text-gray-500">
                {product.avgRating}
              </span>
              <span className="fa fa-star checked text-yellow-300" />
            </label>
            <label>
              <span className="font-semibold text-gray-500">Sold: </span>
              <span className="text-xs text-gray-500">{product.sold}</span>
            </label>
          </div>
          <label className="text-lg font-semibold text-red-600">
            {currencyFormat(price)}
          </label>
        </div>
      </a>
    </Link>
  );
}
