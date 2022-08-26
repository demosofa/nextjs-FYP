import { comment } from "../../../../controllers";
import { db, isAuthentication } from "../../../../helpers";

export default async function productComment(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await comment.getCommentFromProduct(req, res);
      break;
    case "post":
      await isAuthentication(comment.addCommentToProduct)(req, res);
      break;
  }
}
