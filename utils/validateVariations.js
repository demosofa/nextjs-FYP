import Validate from "./Validate";

export default function validateVariations(variations) {
  if (variations.length) {
    variations.forEach(({ sale, time, ...others }) => {
      if (sale && time) others = { ...others, sale };
      Object.entries(others).forEach((entry) => {
        switch (entry[0]) {
          case "sku":
            new Validate(entry[1]).isEmpty();
            break;
          case "price":
          case "cost":
          case "sale":
            new Validate(entry[1]).isEmpty().isVND();
            break;
          case "quantity":
          case "length":
          case "width":
          case "height":
            new Validate(entry[1]).isEmpty().isNumber();
            break;
        }
      });
      if (sale > others.price) throw new Error("Why sale is larger than price");
    });
  }
}
