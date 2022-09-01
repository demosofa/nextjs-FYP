import IGenericRepository from "../interfaces/IGenericRepository";
import {
  FilterQuery,
  Model,
  QueryOptions,
  UpdateWithAggregationPipeline,
  UpdateQuery,
  SaveOptions,
  PipelineStage,
  AggregateOptions,
} from "mongoose";

export default class GenericRepository<T> implements IGenericRepository<T> {
  private context: typeof Model;
  constructor(context: typeof Model) {
    this.context = context;
  }
  aggregate(pipeline?: PipelineStage[], options?: AggregateOptions) {
    return this.context.aggregate(pipeline, options);
  }
  countData(filter: FilterQuery<any> = {}, options?: QueryOptions<any>) {
    return this.context.countDocuments(filter, options);
  }
  getById(id: string) {
    return this.context.findById(id);
  }
  getOne(filter: FilterQuery<T>) {
    return this.context.findOne(filter);
  }
  getAll(filter: FilterQuery<T>) {
    return this.context.find(filter);
  }
  async create(data: T, options?: SaveOptions) {
    return (await this.context.create([data], options))[0];
  }
  updateById(
    id: string,
    update: UpdateQuery<any>,
    options?: QueryOptions<any>
  ) {
    return this.context.findByIdAndUpdate(id, update, options);
  }
  updateOne(
    filter: FilterQuery<any>,
    update: UpdateWithAggregationPipeline | UpdateQuery<any>,
    options?: QueryOptions<any>
  ) {
    return this.context.updateOne(filter, update, options);
  }
  updateMany(
    filter: FilterQuery<any>,
    update: UpdateQuery<any> | UpdateWithAggregationPipeline,
    options?: QueryOptions<any>
  ) {
    return this.context.updateMany(filter, update, options);
  }
  deleteById(id: string, options?: QueryOptions<any>) {
    return this.context.findByIdAndDelete(id, options);
  }
  deleteOne(filter: FilterQuery<T>, options?: QueryOptions<any>) {
    return this.context.deleteOne(filter, options);
  }
  deleteMany(filter: FilterQuery<any>, options?: QueryOptions<any>) {
    return this.context.deleteMany(filter, options);
  }
}
