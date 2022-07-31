import UnitOfWork from "./services/UnitOfWork";
import { parseForm } from "../helpers";

class CartController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  async read(req, res) {
    const cart = await this.unit.Cart.getById(req.query.id);
    if (!cart) return res.status(500).json({ message: "Cant find cart" });
    return res.status(200).json(cart);
  }
  async update(req, res) {
    const result = await parseForm(req);
    const data = await this.unit.Cart.getById(req.query.id);
    if (!data) return res.status(500).json({ message: "Cart not exist" });
    const update = await this.unit.Cart.updateById(req.query.id, result.fields);
    if (!update)
      return res.status(500).json({ message: "fail to update Cart" });
    return res.status(200).json({ message: "success update cart" });
  }
}

export default new CartController();
