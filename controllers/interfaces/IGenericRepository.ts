export default interface IGenericRepository<T>{
  getById(id: string) : any;
  getOne(condition: object) : any;
  getAll(condition: object): any;
  create(data: T, options?: object): any;
  updateById(id: string, update: object, options?: object): any;
  updateOne(condition: object, update: object, options?: object): any;
  deleteById(id: string, options?: object): any
  deleteOne(condition: object, options?: object) : any;
}