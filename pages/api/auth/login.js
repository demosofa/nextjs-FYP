import { auth } from "../../../controllers";

export default async function (req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      break;
    case "post":
      await auth.login(req, res);
      break;
  }
}
