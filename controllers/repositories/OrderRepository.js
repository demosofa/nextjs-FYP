import GenericRepository from "../services/GenericRepository";
const Order = require("../../models/Order");

export default class OrderRepository extends GenericRepository {
  constructor() {
    super(Order);
  }
}
