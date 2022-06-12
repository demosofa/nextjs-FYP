import UnitOfWork from "./actions/UnitOfWork";

class CartController extends UnitOfWork {
  constructor() {
    super();
  }

  get() {
    this.Cart.getOne();
  }
}
