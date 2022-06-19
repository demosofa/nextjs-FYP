import IGenericRepository from "../interfaces/IGenericRepository";

export default class GenericRepository<T> implements IGenericRepository<T> {
  private context: any;
  constructor(context: any) {
    this.context = context;
  }
  async getOne(value: string, prop = "id") {
    return await this.context.findOne({ [prop]: value }).exec();
  }
  async getAll(aggregate: Array<any>) {
    return new Promise(async (resolve, reject) => {
      const itemdata = await this.context.aggregate(aggregate).exec();
      if (!itemdata) reject(null);
      resolve(itemdata);
    });
  }
  async create(data: T) {
    return this.context.create(data);
  }
  async updateById(id: string, data: T) {
    return this.context.updateOne({_id: id}, data).exec();
  }
  async deleteOne(value: string, prop = "id") {
    return this.context.deleteOne({ [prop]: value }).exec();
  }
}
