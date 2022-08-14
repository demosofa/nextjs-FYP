import GenericRepository from "../services/GenericRepository";
const Comment = require("../../models/Comment");

export default class CommentRepository extends GenericRepository {
  constructor() {
    super(Comment);
  }
}
