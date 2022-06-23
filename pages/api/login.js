import dbConnect from "../../helpers/dbConnect";
import account from "../../controllers/AccountController";

export default async function (req, res) {
  await dbConnect();
  switch (req.method.toLowerCase()) {
    case "get":
      break;
    case "post":
      await account.login(req, res);
      break;
  }
}
