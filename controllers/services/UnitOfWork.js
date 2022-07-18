import {
  ProdcutRepository,
  CartRepository,
  OrderRepository,
  AccountRepository,
  CategoryRepository,
  UserRepository,
  VariantRepository,
  VariationRepository,
  VariantOptRepository,
} from "../repositories";

class UnitOfWork {
  constructor() {
    this.Account = new AccountRepository();
    this.User = new UserRepository();
    this.Product = new ProdcutRepository();
    this.Cart = new CartRepository();
    this.Order = new OrderRepository();
    this.Category = new CategoryRepository();
    this.Variant = new VariantRepository();
    this.Variation = new VariationRepository();
    this.Option = new VariantOptRepository();
  }
}

export default UnitOfWork;
