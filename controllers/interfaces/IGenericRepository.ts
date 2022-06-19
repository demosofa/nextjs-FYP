export default interface IGenericRepository<T>{
  getOne(value: string, prop: string) : Promise<any>;
  getAll(aggregate: Array<any>): Promise<any>;
  create(data: T): Promise<any>;
  updateById(id: string, data: T): Promise<any>;
  deleteOne(value: string, prop: string) : Promise<any>;
}