import {
  ProdcutRepository,
  CartRepository,
  OrderRepository,
  AccountRepository,
  CategoryRepository,
} from "../repositories";

class UnitOfWork {
  constructor() {
    this.Account = new AccountRepository();
    this.Product = new ProdcutRepository();
    this.Cart = new CartRepository();
    this.Order = new OrderRepository();
    this.Category = new CategoryRepository();
  }
}

export default UnitOfWork;
