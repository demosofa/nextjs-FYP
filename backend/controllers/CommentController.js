import models from "../models";

class CommentController {
  getCommentFromProduct = async (req, res) => {
    let { id, sort, page, limit } = req.query;
    if (!sort) sort = { updatedAt: 1 };
    if (!limit) limit = 10;
    const comments = await models.Comment.find({ productId: id })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: "author", select: ["username"] })
      .lean();
    if (!comments)
      return res.status(500).json({ message: "Fail to load comment" });
    const countComments = await models.Comment.countDocuments({
      productId: id,
    }).lean();
    const pageCounted = Math.ceil(countComments / limit);
    return res.status(200).json({ comments, pageCounted });
  };
  getSubComment = async (req, res) => {
    const id = req.query.id;
    const { replies } = await models.Comment.findById(id)
      .select("replies")
      .populate({
        path: "replies",
        options: {
          sort: { updatedAt: -1 },
        },
        populate: { path: "author", select: ["username"] },
      })
      .lean();
    if (!replies) return res.status(500).json({ message: "Cannot get reply" });
    return res.status(200).json(replies);
  };
  addCommentToProduct = async (req, res) => {
    const id = req.query.id;
    const { content } = req.body;
    const created = await models.Comment.create({
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
    const comment = await models.Comment.create({
      author: req.user.accountId,
      content,
    }).then((value) =>
      value.populate({ path: "author", select: ["username"] })
    );
    if (!comment)
      return res.status(500).json({ message: "Fail to create comment" });
    const updated = await models.Comment.findByIdAndUpdate(id, {
      $push: { replies: comment._id },
    });
    if (!updated)
      return res
        .status(500)
        .json({ message: "Fail to add comment to parent Comment" });
    return res.status(200).json(comment);
  };
  patch = async (req, res) => {
    const id = req.query.id;
    const updated = await models.Comment.findByIdAndUpdate(id, {
      $set: req.body,
    });
    if (!updated)
      return res.status(500).json({ message: "Fail to update comment" });
    return res.status(200).json(updated);
  };
  delete = async (req, res) => {
    const id = req.query.id;
    const deleted = await models.Comment.findByIdAndDelete(id);
    if (!deleted)
      return res.status(500).json({ message: "Cannot delete comment" });
    return res.status(200).end();
  };
}

export default new CommentController();
