import Image from "next/image";
import { Slider } from "../../components";
import { currencyFormat } from "../../shared";
import styles from "../../styles/Home.module.scss";

export default function ProductSlider({ products }) {
  return (
    <Slider
      config={{
        slides: {
          perView: "auto",
          spacing: 20,
        },
      }}
    >
      <Slider.Content className="p-2">
        {products.map((item) => {
          return (
            <a
              key={item.title}
              href={item.url}
              className="card relative mt-2 h-fit min-h-0 !max-w-[140px] cursor-pointer !overflow-visible"
            >
              <div className={styles.price_tag}>
                <p className={styles.price_tag_price}>
                  {currencyFormat(item.sale ? item.sale : item.price) ||
                    "optional"}
                </p>
              </div>
              <div>
                <div className="relative h-36 w-full rounded-xl">
                  <Image alt="product" src={item.thumbnail} layout="fill" />
                </div>
                <label className="text-sm line-clamp-1">{item.title}</label>
                <span className="float-right">Sold: {item.sold}</span>
              </div>
            </a>
          );
        })}
      </Slider.Content>
    </Slider>
  );
}
