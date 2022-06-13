import UnitOfWork from "./actions/UnitOfWork";

class CartController {
  constructor() {
    this.unit = new UnitOfWork();
  }

  get() {
    this.unit.Cart.getOne();
  }
}
