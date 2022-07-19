import GenericRepository from "../services/GenericRepository";
const VariantOption = require("../../models/VariantOption");
export default class VariantOptRepository extends GenericRepository {
  constructor() {
    super(VariantOption);
  }
}
