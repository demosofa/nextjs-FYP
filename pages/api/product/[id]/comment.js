import { comment } from "../../../../controllers";
import { db, isAuthentication } from "../../../../helpers";

export default async function (req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await comment.getCommentFromProduct(req, res);
      break;
    case "post":
      await isAuthentication(comment.addCommentToProduct.bind(comment))(
        req,
        res
      );
      break;
  }
}
