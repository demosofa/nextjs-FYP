const mongoose = require("mongoose");

export default class IItemData {
  constructor(type) {
    this.ItemData = mongoose.models[type];
  }
  async getOne(value, prop = "id") {
    return await this.ItemData.findOne({ [prop]: value }).exec();
  }
  async getAll(aggregate = []) {
    return new Promise(async (resolve, reject) => {
      const itemdata = await this.ItemData.aggregate(aggregate).exec();
      if (!itemdata) reject(null);
      resolve(itemdata);
    });
  }
  async create(data) {
    const check = await this.get(data.id);
    if (!check) await this.ItemData.create(data);
  }
  async updateOne(condition, data) {
    await this.ItemData.updateOne(condition, data);
  }
  async deleteOne(value, prop = "id") {
    await this.ItemData.deleteOne({ [prop]: value });
  }
}
