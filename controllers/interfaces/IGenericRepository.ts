export default interface IGenericRepository<T> {
  countData(filter: object, options?: object): any;
  getById(id: string): any;
  getOne(filter: object): any;
  getAll(filter: object): any;
  create(data: T, options?: object): any;
  updateById(id: string, update: object, options?: object): any;
  updateOne(filter: object, update: object, options?: object): any;
  updateMany(filter: object, update: object, options?: object): any;
  deleteById(id: string, options?: object): any;
  deleteOne(filter: object, options?: object): any;
  deleteMany(filter: object, options?: object): any;
}
