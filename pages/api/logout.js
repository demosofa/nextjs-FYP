import dbConnect from "../../helpers/dbConnect";
import account from "../../controllers/AccountController";

export default async function (req, res) {
  await dbConnect();
  switch (req.method.toLowerCase()) {
    case "post":
      await account.logout(req, res);
      break;
  }
}
