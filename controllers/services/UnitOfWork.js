import {
  ProdcutRepository,
  CartRepository,
  OrderRepository,
  AccountRepository,
} from "../repositories";

class UnitOfWork {
  constructor() {
    this.Account = new AccountRepository();
    this.Product = new ProdcutRepository();
    this.Cart = new CartRepository();
    this.Order = new OrderRepository();
  }
}

export default UnitOfWork;
