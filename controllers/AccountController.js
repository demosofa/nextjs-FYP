import UnitOfWork from "./services/UnitOfWork";
import bcrypt from "bcrypt";
import { Token } from "../utils";

class AccountController {
  constructor() {
    this.unit = new UnitOfWork();
  }

  async login(req, res) {
    const { username, password } = req.body;
    const check = await this.unit.Account.getOne(username, "username");
    if (!check)
      return res
        .status(300)
        .json({ message: "there is no account with this username" });
    const validPass = await bcrypt.compare(password, check.hashPassword);
    if (!validPass)
      return res.status(300).json({ message: "Invalid password" });
    const { token, refeshToken } = new Token({ userId: check._id });
    return res.status(200).json({ token, refeshToken });
  }

  async register(req, res) {
    const { account, userInfo } = req.body;
    const isExisted = await this.unit.Account.getOne(
      account.username,
      "username"
    );
    if (isExisted)
      return res.status(300).json({
        message: "There is already existed account with this username",
      });
    let hashPassword = await bcrypt.hash(account.password, 10);
    const created = await this.unit.Account.create({
      username: account.username,
      password: hashPassword,
    });
    if (!created)
      return res.status(500).json({ message: "Fail to Create Account" });
    const user = await this.unit.User.create({
      ...userInfo,
      account: created._id,
    });
    if (!user) return res.status(500).json({ message: "Fail to Register" });
    const { token, refeshToken } = new Token({ userId: user._id });
    return res.status(200).json({ token, refeshToken });
  }
}

export default new AccountController();
