import parseForm from "./services/parseForm";
import UnitOfWork from "./services/UnitOfWork";

class CartController {
  constructor() {
    this.unit = new UnitOfWork();
  }

  async read(req, res) {
    const data = await this.unit.Cart.getOne(req.query.id);
    if (!data) return res.status(500).json({ message: "Cant find cart" });
    return res.status(200).json({ data });
  }
  async update(req, res) {
    const result = await parseForm(req);
    const data = await this.unit.Cart.getOne(req.query.id);
    if (!data) return res.status(500).json({ message: "Cart not exist" });
    const update = await this.unit.Cart.updateById(req.query.id, result.fields);
    return res.status(200).json({ message: "success update cart" });
  }
}

export default new CartController();
