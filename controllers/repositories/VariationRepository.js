import GenericRepository from "../services/GenericRepository";
const ProductVariation = require("../../models/ProductVariation");

export default class VariationRepository extends GenericRepository {
  constructor() {
    super(ProductVariation);
  }
}
