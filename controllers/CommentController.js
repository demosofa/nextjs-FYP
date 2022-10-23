import UnitOfWork from "./services/UnitOfWork";

class CommentController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  getCommentFromProduct = async (req, res) => {
    let { id, sort, page, limit } = req.query;
    if (!sort) sort = { updatedAt: 1 };
    if (!limit) limit = 10;
    const comments = await this.unit.Comment.getAll({ productId: id })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: "author", select: ["username"] })
      .lean();
    if (!comments)
      return res.status(500).json({ message: "Fail to load comment" });
    const countComments = await this.unit.Comment.countData({
      productId: id,
    }).lean();
    const pageCounted = Math.ceil(countComments / limit);
    return res.status(200).json({ comments, pageCounted });
  };
  getSubComment = async (req, res) => {
    const id = req.query.id;
    const { replys } = await this.unit.Comment.getById(id)
      .select("replys")
      .populate({
        path: "replys",
        options: {
          sort: { updatedAt: -1 },
        },
        populate: { path: "author", select: ["username"] },
      })
      .lean();
    if (!replys) return res.status(500).json({ message: "Cannot get reply" });
    return res.status(200).json(replys);
  };
  addCommentToProduct = async (req, res) => {
    const id = req.query.id;
    const { content } = req.body;
    const created = await this.unit.Comment.create({
      productId: id,
      author: req.user.accountId,
      content,
    }).then((value) =>
      value.populate({ path: "author", select: ["username"] })
    );
    if (!created)
      return res.status(500).json("Fail to create Comment for Product");
    return res.status(200).json(created);
  };
  addSubComment = async (req, res) => {
    const id = req.query.id;
    const { content } = req.body;
    const comment = await this.unit.Comment.create({
      author: req.user.accountId,
      content,
    }).then((value) =>
      value.populate({ path: "author", select: ["username"] })
    );
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
  };
  patch = async (req, res) => {
    const id = req.query.id;
    const updated = await this.unit.Comment.updateById(id, { $set: req.body });
    if (!updated)
      return res.status(500).json({ message: "Fail to update comment" });
    return res.status(200).end();
  };
  delete = async (req, res) => {
    const id = req.query.id;
    const deleted = await this.unit.Comment.deleteById(id);
    if (!deleted)
      return res.status(500).json({ message: "Cannot delete comment" });
    return res.status(200).end();
  };
}

export default new CommentController();
