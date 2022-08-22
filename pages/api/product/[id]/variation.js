import { product } from "../../../../controllers";

async function productVariation(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await product.getVariation(req, res);
      break;
    case "patch":
      await product.patchVariation(req, res);
      break;
  }
}

export default productVariation;
