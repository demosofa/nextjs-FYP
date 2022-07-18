import GenericRepository from "../services/GenericRepository";
const ProductVariant = require("../../models/ProductVariant");

export default class VariationRepository extends GenericRepository {
  constructor() {
    super(ProductVariant);
  }
}
