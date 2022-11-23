import { auth } from "../../../../../backend/controllers";

export default async function resetPwd(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await auth.resetLink(req, res);
      break;
    case "post":
      await auth.reset(req, res);
      break;
  }
}
