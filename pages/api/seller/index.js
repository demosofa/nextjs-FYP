import { seller } from "../../../controllers";

async function sellerIndex(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await seller.todayValidated(req, res);
      break;
  }
}
