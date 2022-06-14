import GenericRepository from "../services/GenericRepository";
const Account = require("../../models/Account");

export default class AccountRepository extends GenericRepository {
  constructor() {
    super(Account);
  }
}
