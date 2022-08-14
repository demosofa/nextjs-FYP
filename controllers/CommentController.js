import UnitOfWork from "./services/UnitOfWork";

class CommentController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  async getCommentFromProduct(req, res) {
    const { id, page } = req.query;
    const { comments } = await this.unit.Product.getById(id)
      .select("comments")
      .populate({
        path: "comments",
        options: {
          skip: (page - 1) * 10,
          limit: 10,
        },
      })
      .exec();
    if (!comments)
      return res.status(500).json({ message: "Fail to load comment" });
    return res.status(200).json(comments);
  }
  async getSubComment(req, res) {
    const id = req.query.id;
    const { replys } = await this.unit.Comment.getById(id)
      .select("replys")
      .populate("replys")
      .exec();
    if (!replys) return res.status(500).json({ message: "Cannot get reply" });
    return res.status(200).json(replys);
  }
  async addCommentToProduct(req, res) {
    const id = req.query.id;
    const { content } = req.body;
    const created = await this.unit.Comment.create({
      author: req.user.accountId,
      content,
    });
    if (!created)
      return res.status(500).json("Fail to create Comment for Product");
    const updated = await this.unit.Product.updateById(id, {
      $push: { comments: created._id },
    });
    if (!updated)
      return res.status(500).json("Fail to insert comment to Product");
    return res.status(200).json(created);
  }
  async addSubComment(req, res) {
    const id = req.query.id;
    const { content } = req.body;
    const comment = await this.unit.Comment.create({
      author: req.user.accountId,
      content,
    });
    if (!comment)
      return res.status(500).json({ message: "Fail to create comment" });
    const updated = await this.unit.Comment.updateById(id, {
      $push: { replys: comment._id },
    });
    if (!updated)
      return res
        .status(500)
        .json({ message: "Fail to add comment to parent Comment" });
    return res.status(200).json(comment);
  }
  async patch(req, res) {
    const id = req.query.id;
    const updated = await this.unit.Comment.updateById(id, { $set: req.body });
    if (!updated)
      return res.status(500).json({ message: "Fail to update comment" });
    return res.status(200).end();
  }
  async delete(req, res) {
    const id = req.query.id;
    const deleted = await this.unit.Comment.deleteById(id);
    if (!deleted)
      return res.status(500).json({ message: "Cannot delete comment" });
    return res.status(200).end();
  }
}

export default new CommentController();
