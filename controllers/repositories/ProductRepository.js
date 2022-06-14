import GenericRepository from "../services/GenericRepository";
const Product = require("../../models/Product");

export default class ProdcutRepository extends GenericRepository {
  constructor() {
    super(Product);
  }
}
