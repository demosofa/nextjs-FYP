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
  async create(data: any) {
    const check = await this.getOne(data.id);
    if (!check) await this.context.create(data);
  }
  async updateOne(data: T, condition: Object) {
    await this.context.updateOne(condition, data).exec();
  }
  async deleteOne(value: string, prop = "id") {
    await this.context.deleteOne({ [prop]: value }).exec();
  }
}
