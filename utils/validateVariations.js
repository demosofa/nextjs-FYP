import Validate from "./Validate";

export default function validateVariations(variations) {
  if (variations.length) {
    variations.forEach(({ compare, ...others }) => {
      if (compare && compare != 0) others = { ...others, compare };
      Object.entries(others).forEach((entry) => {
        switch (entry[0]) {
          case "price":
          case "cost":
          case "compare":
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
      if (others.compare <= others.price)
        throw new Error("Why is the compare less than or equal to price?");
    });
  }
}
