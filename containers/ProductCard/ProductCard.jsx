import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { currencyFormat } from "../../shared";
import styles from "../../styles/Home.module.scss";

export default function ProductCard({ product, ...props }) {
  const { price, sale } = useMemo(() => {
    if (product.time && new Date(product.time).getTime() > Date.now())
      return { price: product.price, sale: product.sale };
    else return { price: product.price, sale: 0 };
  }, [product]);
  return (
    <Link {...props}>
      <a className="card relative mt-2 cursor-pointer">
        <div className={styles.price_tag}>
          <p className={styles.price_tag_price}>
            {currencyFormat(sale ? sale : price)}
          </p>
        </div>
        {sale ? (
          <span className={styles.sale}>
            -{Math.ceil(100 - (sale / price) * 100)}%
          </span>
        ) : null}
        <div>
          <div className="relative h-44 w-full">
            <Image
              className="rounded-xl"
              alt="product"
              src={product.thumbnail}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <label className="text-sm line-clamp-1">{product.title}</label>
          <label className="float-left">
            <span className="fa fa-star checked mr-1 text-yellow-300 " />
            <span className="font-semibold italic">{product.avgRating}</span>
          </label>
          <label className="float-right">
            <span className="font-semibold">Sold: </span>
            <span className="text-xs text-gray-400">{product.sold}</span>
          </label>
        </div>
      </a>
    </Link>
  );
}