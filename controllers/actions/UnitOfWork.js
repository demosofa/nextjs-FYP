import GenericRepository from "./GenericRepository";

class UnitOfWork {
  constructor() {
    this.Account = new GenericRepository("Account");
    this.Product = new GenericRepository("Product");
    this.Cart = new GenericRepository("Cart");
    this.Order = new GenericRepository("Order");
  }
}

export default UnitOfWork;
