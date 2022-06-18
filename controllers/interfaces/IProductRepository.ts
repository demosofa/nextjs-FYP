import IGenericRepository from "./IGenericRepository";
const Product = require("../../models/Product")

export default interface IProductRepository extends IGenericRepository<typeof Product>{
  id: string,
  title: string,
  description: string,
  status: string,
  thumbnail: File,
  tags: Array<string>,
  files: Array<File>,
  price: number,
  quantity: number
}