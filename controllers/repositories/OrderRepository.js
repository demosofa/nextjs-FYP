import GenericRepository from "../services/GenericRepository";

export default class OrderRepository extends GenericRepository {
  constructor() {
    super("Order");
  }
}
