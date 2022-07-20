import IGenericRepository from "../interfaces/IGenericRepository";
import {Model} from "mongoose"

export default class GenericRepository<T> implements IGenericRepository<T> {
  private context: typeof Model;
  constructor(context: typeof Model) {
    this.context = context;
  }
  getOne(value: string, prop = "_id") {
    return this.context.findOne({ [prop]: value }).exec();
  }
  getAll(condition: object) {
    return this.context.find(condition).exec();
  }
  create(data: T) {
    return this.context.create(data);
  }
  updateById(id: string, data: T) {
    return this.context.updateOne({_id: id}, data).exec();
  }
  deleteOne(value: string, prop = "_id") {
    return this.context.deleteOne({ [prop]: value }).exec();
  }
}
