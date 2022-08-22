import { product } from "../../../../controllers";

async function productImage(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await product.getImage(req, res);
      break;
    case "put":
      await product.putImage(req, res);
      break;
  }
}

export default productImage;
