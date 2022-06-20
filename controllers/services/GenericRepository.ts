import IGenericRepository from "../interfaces/IGenericRepository";

export default class GenericRepository<T> implements IGenericRepository<T> {
  private context: any;
  constructor(context: any) {
    this.context = context;
  }
  getOne(value: string, prop = "id") {
    return this.context.findOne({ [prop]: value }).exec();
  }
  getAll(condition: Object) {
    return this.context.find(condition).exec();
  }
  create(data: T) {
    return this.context.create(data);
  }
  updateById(id: string, data: T) {
    return this.context.updateOne({_id: id}, data).exec();
  }
  deleteOne(value: string, prop = "id") {
    return this.context.deleteOne({ [prop]: value }).exec();
  }
}
