import GenericRepository from "../services/GenericRepository";
const Cart = require("../../models/Cart");

export default class CartRepository extends GenericRepository {
  constructor() {
    super(Cart);
  }
}
