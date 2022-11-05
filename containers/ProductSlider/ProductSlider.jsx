import { Slider } from "../../components";
import ProductCard from "../ProductCard/ProductCard";

export default function ProductSlider({ products }) {
  return (
    <Slider
      config={{
        slides: {
          perView: "auto",
          spacing: 10,
        },
      }}
    >
      <Slider.Content className="p-2">
        {products.map((item) => (
          <ProductCard
            key={item._id}
            href={`/c/${item.productId}?vid=${item._id}`}
            product={item}
          />
        ))}
      </Slider.Content>
    </Slider>
  );
}
