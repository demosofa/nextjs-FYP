import IGenericRepository from "../interfaces/IGenericRepository";
import { FilterQuery, Model, QueryOptions, UpdateWithAggregationPipeline, UpdateQuery, SaveOptions } from "mongoose"

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
  async create(data: T, options?: SaveOptions) {
    return (await this.context.create([data], options))[0];
  }
  updateById(id: string, update: UpdateQuery<any>, options?: QueryOptions<any>) {
    return this.context.findByIdAndUpdate(id, update, options);
  }
  updateOne(condition: FilterQuery<any>, update: UpdateWithAggregationPipeline | UpdateQuery<any>, options?: QueryOptions<any>){
    return this.context.updateOne(condition, update, options)
  }
  deleteById(id: string, options?: QueryOptions<any>) {
    return this.context.findByIdAndDelete(id, options)
  }
  deleteOne(condition: FilterQuery<T>, options?: QueryOptions<any>) {
    return this.context.deleteOne(condition, options);
  }
}
