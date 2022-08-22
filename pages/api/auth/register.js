import { auth } from "../../../controllers";

export default async function (req, res) {
  switch (req.method.toLowerCase()) {
    case "post":
      await auth.register(req, res);
      break;
  }
}
