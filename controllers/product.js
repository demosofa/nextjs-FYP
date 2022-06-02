const Product = require("../models/Product");
import getProduct from "./actions/getProduct";
import parseForm from "./actions/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

const read = async (req, res) => {
  const product = await getProduct(req.query.id);
  if (!product) res.status(404).json({ errorMessage: "Not Found" });
  res.status(200).json({ ...product });
};

const create = async (req, res) => {
  const result = await parseForm(req); //Get Warning
  // const check = await getProduct(result.fields.title, "title");
  // if (!check) {
  //   res
  //     .status(500)
  //     .json({ errorMessage: `Product already has ${result.fields.title}` });
  // }
  // const product = Product.create({ ...result.fields, files: result.files });
  // if (!product) {
  //   res.status(200).json({ message: `Success create ${value}` });
  // }
  res.status(200).json({ message: "Success Create Product" });
  return;
};

const update = async (req, res) => {
  const result = parseForm(req);
  const check = await getProduct(result.fields.title, "title");
  if (!check) {
    res.status(404).json({ errorMessage: "Not found" });
  }
  const updated = await Product.updateOne(
    { _id: req.query.id },
    { ...result.fields, files: result.files }
  );
  res.status(200).json({ successMessage: "Success Update" });
};

const remove = (req, res) => {};

export default { read, create, update, remove };
