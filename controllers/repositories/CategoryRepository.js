import GenericRepository from "../services/GenericRepository";
const Category = require("../../models/Category");

export default class CategoryRepository extends GenericRepository {
  constructor() {
    super(Category);
  }
}
