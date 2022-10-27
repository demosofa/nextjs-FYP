import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { currencyFormat } from "../../shared";
import styles from "../../styles/Home.module.scss";

export default function ProductCard({ product, ...props }) {
  const { price, sale } = useMemo(() => {
    if (product.variations.length) {
      const arrVariationSale = product.variations.filter(
        ({ price, time, sale }) => {
          if (time && new Date(time).getTime() > Date.now())
            return { price, sale };
        }
      );
      if (arrVariationSale.length) {
        let index = 0;
        for (let i = 1; i < arrVariationSale.length; i++) {
          if (arrVariationSale[index].sale > arrVariationSale[i].sale)
            index = i;
        }
        return arrVariationSale[index];
      } else {
        const variationsPrice = product.variations.map(
          (variation) => variation.price
        );
        return { price: Math.min(...variationsPrice), sale: 0 };
      }
    } else {
      let init = { price: product.price, sale: 0 };
      if (product.time && new Date(product.time).getTime() > Date.now())
        init = { ...init, sale: product.sale };
      return init;
    }
  }, [product]);
  return (
    <Link {...props}>
      <a className="card relative mt-2 cursor-pointer">
        <div className={styles.price_tag}>
          <p className={styles.price_tag_price}>
            {currencyFormat(sale ? sale : price)}
          </p>
        </div>
        {sale > 0 ? (
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
