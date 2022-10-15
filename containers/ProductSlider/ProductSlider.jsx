import Image from "next/image";
import { Slider } from "../../components";
import { useMediaContext } from "../../contexts/MediaContext";
import { currencyFormat } from "../../shared";
import styles from "../../styles/Home.module.scss";

export default function ProductSlider({ products }) {
  const { device, Devices } = useMediaContext();
  return (
    <Slider
      config={{
        slides: {
          perView:
            device === Devices.pc
              ? 7
              : device === Devices.tablet
              ? 4
              : device === Devices.phone && 3,
          spacing: 20,
        },
      }}
    >
      <Slider.Arrow>
        <Slider.Content className="p-4">
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
                  <span className="float-right">Sold: </span>
                </div>
              </a>
            );
          })}
        </Slider.Content>
      </Slider.Arrow>
    </Slider>
  );
}
