import { rate } from "../../../backend/controllers";
import { authenticate } from "../../../backend/helpers";

async function rating(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await rate.getRating(req, res);
      break;
    case "put":
      await rate.ratingProduct(req, res);
      break;
  }
}

export default authenticate(rating);
