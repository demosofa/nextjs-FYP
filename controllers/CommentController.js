import { pusher } from "../helpers";
import UnitOfWork from "./services/UnitOfWork";

class CommentController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  getCommentFromProduct = async (req, res) => {
    const { id, page } = req.query;
    const { comments } = await this.unit.Product.getById(id)
      .select("comments")
      .populate({
        path: "comments",
        options: {
          skip: (page - 1) * 10,
          limit: 10,
        },
        populate: "author",
      })
      .exec();
    if (!comments)
      return res.status(500).json({ message: "Fail to load comment" });
    return res.status(200).json(comments);
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
        populate: "author",
      })
      .exec();
    if (!replys) return res.status(500).json({ message: "Cannot get reply" });
    return res.status(200).json(replys);
  };
  addCommentToProduct = async (req, res) => {
    const id = req.query.id;
    const { content } = req.body;
    const created = await this.unit.Comment.create({
      author: req.user.accountId,
      content,
    }).then((value) => value.populate("author"));
    if (!created)
      return res.status(500).json("Fail to create Comment for Product");
    const updated = await this.unit.Product.updateById(id, {
      $push: { comments: created._id },
    });
    if (!updated)
      return res.status(500).json("Fail to insert comment to Product");
    return res.status(200).json(created);
  };
  addSubComment = async (req, res) => {
    const id = req.query.id;
    const { content } = req.body;
    const comment = await this.unit.Comment.create({
      author: req.user.accountId,
      content,
    }).then((value) => value.populate("author"));
    if (!comment)
      return res.status(500).json({ message: "Fail to create comment" });
    const updated = await this.unit.Comment.updateById(id, {
      $push: { replys: comment._id },
    });
    if (!updated)
      return res
        .status(500)
        .json({ message: "Fail to add comment to parent Comment" });
    console.log(req.query.id);
    // await pusher.trigger(`reply-to-${req.query.id}`, "reply", {
    //   message: `You have a reply from ${comment.author.username}`,
    // });
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
