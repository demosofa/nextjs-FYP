import GenericRepository from "../services/GenericRepository";

export default class CartRepository extends GenericRepository {
  constructor() {
    super("Cart");
  }
}
