import GenericRepository from "../services/GenericRepository";
const Rate = require("../../models/Rate");

export default class RateRepository extends GenericRepository {
  constructor() {
    super(Rate);
  }
}
