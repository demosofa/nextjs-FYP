import dbConnect from "../../helpers/dbConnect";

export default async function (req, res) {
  await dbConnect();
  switch (req.method.toLowerCase()) {
    case "get":
      break;
    case "post":
      break;
  }
}
