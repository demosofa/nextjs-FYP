export default interface IGenericRepository<T>{
  getById(id: string) : any;
  getOne(condition: object) : any;
  getAll(condition: object): any;
  create(data: T): any;
  updateById(id: string, data: T): any;
  deleteById(id: string): any
  deleteOne(condition: object) : any;
}