import GenericRepository from "../services/GenericRepository";
const User = require("../../models/User");

export default class UserRepository extends GenericRepository {
  constructor() {
    super(User);
  }
}
