import { Slider } from "../../components";
import ProductCard from "../ProductCard/ProductCard";

const LocalUrl = process.env.NEXT_PUBLIC_DOMAIN;

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
        {products.map((item) => (
          <ProductCard
            key={item._id}
            href={`${LocalUrl}/c/${item._id}`}
            product={item}
          />
        ))}
      </Slider.Content>
    </Slider>
  );
}
