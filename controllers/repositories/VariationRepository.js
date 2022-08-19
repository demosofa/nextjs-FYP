import GenericRepository from "../services/GenericRepository";
const Variation = require("../../models/Variation");

export default class VariationRepository extends GenericRepository {
  constructor() {
    super(Variation);
  }
}
