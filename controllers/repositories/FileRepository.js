import GenericRepository from "../services/GenericRepository";
const File = require("../../models/File");

export default class FileReposiotry extends GenericRepository {
  constructor() {
    super(File);
  }
}
