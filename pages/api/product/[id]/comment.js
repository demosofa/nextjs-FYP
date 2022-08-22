import { comment } from "../../../../controllers";
import { isAuthentication } from "../../../../helpers";

export default async function (req, res) {
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
