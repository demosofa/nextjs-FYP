import GenericRepository from "../services/GenericRepository";
const VariantOptions = require("../../models/VariantOptions");
export default class VariantOptRepository extends GenericRepository {
  constructor() {
    super(VariantOptions);
  }
}
