import dbConnect from "../../helpers/dbConnect";
import bcrypt from "bcrypt";

export default async function (req, res) {
  await dbConnect();
  switch (req.method.toLowerCase()) {
    case "get":
      break;
    case "post":
      const { username, password } = req.body;
      let hashPassword = await bcrypt.hash(password, 10);
      res.status(200).json({ hashPassword });
      break;
  }
}
