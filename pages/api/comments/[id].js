import { comment } from "../../../backend/controllers";
import { db, isAuthentication } from "../../../backend/helpers";

async function commentApi(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await comment.getSubComment(req, res);
      break;
    case "put":
      await comment.addSubComment(req, res);
      break;
    case "patch":
      await comment.patch(req, res);
      break;
    case "delete":
      await comment.delete(req, res);
      break;
  }
}

export default isAuthentication(commentApi);
