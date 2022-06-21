import {
  ProdcutRepository,
  CartRepository,
  OrderRepository,
  AccountRepository,
  CategoryRepository,
  UserRepository,
} from "../repositories";

class UnitOfWork {
  constructor() {
    this.Account = new AccountRepository();
    this.User = new UserRepository();
    this.Product = new ProdcutRepository();
    this.Cart = new CartRepository();
    this.Order = new OrderRepository();
    this.Category = new CategoryRepository();
  }
}

export default UnitOfWork;
