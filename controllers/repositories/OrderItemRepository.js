import GenericRepository from "../services/GenericRepository";
const OrderItem = require("../../models/OrderItem");

export default class OrderItemRepository extends GenericRepository {
  constructor() {
    super(OrderItem);
  }
}
