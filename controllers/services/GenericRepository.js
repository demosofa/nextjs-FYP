export default class GenericRepository {
  constructor(context) {
    this.context = context;
  }
  async getOne(value, prop = "id") {
    return await this.context.findOne({ [prop]: value }).exec();
  }
  async getAll(aggregate = []) {
    return new Promise(async (resolve, reject) => {
      const itemdata = await this.context.aggregate(aggregate).exec();
      if (!itemdata) reject(null);
      resolve(itemdata);
    });
  }
  async create(data) {
    const check = await this.getOne(data.id);
    if (!check) await this.context.create(data).exec();
  }
  async updateOne(condition, data) {
    await this.context.updateOne(condition, data).exec();
  }
  async deleteOne(value, prop = "id") {
    await this.context.deleteOne({ [prop]: value }).exec();
  }
}
