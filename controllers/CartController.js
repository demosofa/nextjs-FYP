import UnitOfWork from "./services/UnitOfWork";

class CartController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  read = async (req, res) => {
    const cart = await this.unit.Cart.getById(req.query.id);
    if (!cart) return res.status(500).json({ message: "Cant find cart" });
    return res.status(200).json(cart);
  };
  update = async (req, res) => {
    const data = await this.unit.Cart.getById(req.query.id);
    if (!data) return res.status(500).json({ message: "Cart not exist" });
    const update = await this.unit.Cart.updateById(req.query.id, res.body);
    if (!update)
      return res.status(500).json({ message: "fail to update Cart" });
    return res.status(200).json({ message: "success update cart" });
  };
}

export default new CartController();
