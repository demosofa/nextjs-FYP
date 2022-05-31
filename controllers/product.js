import Product from "../models/Product";
import getProduct from "./actions/getProduct";
import parseForm from "./actions/parseForm";

const read = async (req, res) => {
  const product = await getProduct(req.query.id);
  if (!product) res.status(404).json({ errorMessage: "Not Found" });
  res.status(200).json({ ...product });
};

const create = async (req, res) => {
  const result = await parseForm(req);
  const check = await getProduct(result.fields.productName, "productName");
  if (!check) {
    Product.create({ ...result.fields, files: result.files }, (err, value) => {
      if (err) res.status(500).json({ errorMessage: "Server fail" });
    });
  }
  res
    .status(500)
    .json({ errorMessage: `Product already has ${result.fields.productName}` });
};

const update = async (req, res) => {
  const result = await parseForm(req);
  const check = await getProduct(result.fields.productName, "productName");
  if (!check) {
    res.status(404).json({ errorMessage: "Not found" });
  }
  Product.updateOne(
    { _id: req.query.id },
    { ...result.fields, files: result.files }
  );
  res.status(200).json({ successMessage: "Success Update" });
};

const remove = (req, res) => {};

export default { read, create, update, remove };
