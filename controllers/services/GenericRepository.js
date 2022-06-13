const mongoose = require("mongoose");

export default class GenericRepository {
  constructor(type) {
    this.entity = mongoose.models[type];
  }
  async getOne(value, prop = "id") {
    return await this.entity.findOne({ [prop]: value }).exec();
  }
  async getAll(aggregate = []) {
    return new Promise(async (resolve, reject) => {
      const itemdata = await this.entity.aggregate(aggregate).exec();
      if (!itemdata) reject(null);
      resolve(itemdata);
    });
  }
  async create(data) {
    const check = await this.getOne(data.id);
    if (!check) await this.entity.create(data).exec();
  }
  async updateOne(condition, data) {
    await this.entity.updateOne(condition, data).exec();
  }
  async deleteOne(value, prop = "id") {
    await this.entity.deleteOne({ [prop]: value }).exec();
  }
}
