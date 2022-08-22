import GenericRepository from "../services/GenericRepository";
const Shipper = require("../../models/Shipper");

export default class ShipperRespository extends GenericRepository {
  constructor() {
    super(Shipper);
  }
}
