import GenericRepository from "../services/GenericRepository";
const Variant = require("../../models/Variant");

export default class VariantRepository extends GenericRepository {
  constructor() {
    super(Variant);
  }
}
