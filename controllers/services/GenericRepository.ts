import IGenericRepository from "../interfaces/IGenericRepository";
import { FilterQuery, Model } from "mongoose"

export default class GenericRepository<T> implements IGenericRepository<T> {
  private context: typeof Model;
  constructor(context: typeof Model) {
    this.context = context;
  }
  getById(id: string) {
    return this.context.findById(id);
  }
  getOne(condition: FilterQuery<T>) {
    return this.context.findOne(condition);
  }
  getAll(condition: FilterQuery<T>) {
    return this.context.find(condition);
  }
  create(data: T) {
    return this.context.create(data);
  }
  updateById(id: string, data: T) {
    return this.context.findByIdAndUpdate(id, data);
  }
  deleteById(id: string) {
    return this.context.findByIdAndDelete(id)
  }
  deleteOne(condition: FilterQuery<T>) {
    return this.context.deleteOne(condition);
  }
}
